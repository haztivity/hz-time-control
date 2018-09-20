import {
    $,
    Navigator,
    INavigatorPageData,
    Component,
    ComponentController,
    EventEmitterFactory,
    PageManager,
    PageController,
    DataOptions,
    ScoFactory,
    PageImplementation,
    DevTools,
    ScormService,
    ScoController
} from "@haztivity/core";
import "jquery-ui-dist/jquery-ui";
@Component(
    {
        name: "HzTimeControl",
        dependencies: [
            $,
            EventEmitterFactory,
            Navigator,
            PageManager,
            DataOptions,
            ScormService,
            DevTools
        ]
    }
)
export class HzTimeControlComponent extends ComponentController {
    public static readonly NAMESPACE = "hzTimeControl";
    protected static readonly PREFIX = "hz-time-control";
    public static readonly ON_PROCESS_STARTS = `${HzTimeControlComponent.NAMESPACE}:process-start`;
    public static readonly ON_PROCESS_COMPLETE = `${HzTimeControlComponent.NAMESPACE}:process-complete`;
    public static readonly ON_WAITING_STARTS = `${HzTimeControlComponent.NAMESPACE}:waitingstarts`;
    public static readonly ON_WAITING_COMPLETE = `${HzTimeControlComponent.NAMESPACE}:waitingcomplete`;
    protected static __instance;
    protected static readonly _DEFAULTS = {
        scale:false
    };
    protected _currentPage:PageImplementation;
    protected _dateCurrentPageStart:Date;
    protected _dateCurrentPageEnd:Date;
    protected _currentPageRequiredTime:number;
    protected _currentTimeToWait:number;
    protected _currentSco = ScoFactory.getCurrentSco();
    protected _totalTimeInMillis:number;
    protected _times = new Map();
    protected _waiting:boolean;
    protected _currentWaitTimeout;
    protected _debugWaitingTimeInterval;
    protected _pageChangeCompleted:boolean;
    protected _startWaitingDate:Date;
    protected _state;
    constructor(_$: JQueryStatic, _EventEmitterFactory, protected _Navigator: Navigator, protected _PageManager: PageManager, protected _DataOptions, protected _ScormService, protected _DevTools) {
        super(_$, _EventEmitterFactory);
        if(HzTimeControlComponent.__instance){
            throw "[HzTimeControlComponent] There must be only one component of HzTimeControl";
        }
        HzTimeControlComponent.__instance = this;
    }

    init(options, config?) {
        this._options = $.extend(true, {}, HzTimeControlComponent._DEFAULTS, options);
        if(this._options.time == undefined){
            throw "[HzTimeControlComponent] The option 'time' is mandatory";
        }
        this._options.time = Math.round(this._options.time);
        this._totalTimeInMillis = this._options.time * 60000;
        let state = [];
        if(this._ScormService.LMSIsInitialized()){
            const data = this._ScormService.doLMSGetValue("cmi.suspend_data");
            if(data){
                try{
                    state = JSON.parse(data).tc || [];
                }catch(e){
                    state = [];
                }
            }
        }
        this._state = state;
        //map times
        if(this._options.times){
            for(let time in this._options.times){
                let options = this._options.times[time];
                options.weight = options.weight != undefined ? Math.round(options.weight) : 1;
                options.completed = state.indexOf(time) != -1;
                this._times.set(time,options);
            }
        }
        //get the weights from pages and set into options
        const pages = this._PageManager.getPages();
        for(let pageImplementation of pages){
            const options = (<any>pageImplementation.getPage().getOptions()).timeControl;
            if(options){
                const name = pageImplementation.getPageName();
                options.weight = options.weight != undefined ? Math.round(options.weight) : 1;
                options.completed = state.indexOf(name) != -1;
                this._times.set(name,options);
            }
        }
        this._assignEvents();
    }
    /**
     * Asigna los handlers a eventos
     * @protected
     */
    protected _assignEvents() {
        this._eventEmitter.globalEmitter.on(ScoController.ON_BEFORE_EXIT,{instance:this},this._onScoExit);
        this._Navigator.on(Navigator.ON_CHANGE_PAGE_START, {instance: this}, this._onPageChangeStart);
        this._Navigator.on(Navigator.ON_CHANGE_PAGE_END, {instance: this}, this._onPageChangeEnd);
        this._Navigator.on(Navigator.ON_NEXT_ENABLE,{instance:this},this._onNavigatorEnabled);
    }
    protected _onScoExit(e){
        let instance = e.data.instance;
        instance._completeCurrentProcess(true);
    }
    protected _getOptionsForPage(pageName){
        return this._times.get(pageName);
    }
    protected _getCurrentWeight(){
        let pages:PageImplementation[] = this._PageManager.getPages(),
            weight = 0;
        for(let pageImplementation of pages){
            const options = this._getOptionsForPage(pageImplementation.getPageName());
            if(!options.completed){
                weight += options.weight;
            }
        }
        return weight;
    }
    protected _onNavigatorEnabled(e){
        let instance = e.data.instance;
        if(instance._waiting){
            instance._Navigator.setNextDisabled(true);
        }
    }
    protected _endWaiting(){
        this._waiting = false;
        if(this._currentWaitTimeout) {
            clearTimeout(this._currentWaitTimeout);
            this._currentWaitTimeout = null;
        }
        if(this._debugWaitingTimeInterval) {
            clearInterval(this._debugWaitingTimeInterval);
            this._debugWaitingTimeInterval = null;
        }
        this._startWaitingDate = null;
        this._currentTimeToWait = null;
    }
    protected _startWaiting(){
        if(!this._waiting){
            this._waiting = true;
            this._Navigator.setNextDisabled(true);
            let pageTime = (this._dateCurrentPageEnd ? this._dateCurrentPageEnd.getTime() : new Date().getTime())- this._dateCurrentPageStart.getTime(),
                timeToWait = Math.round(this._currentPageRequiredTime - pageTime);
            this._currentTimeToWait = timeToWait >= 2000 ? timeToWait : 2000;
            this._startWaitingDate = new Date();
            let that = this;
            this._currentWaitTimeout = setTimeout(function(){that._onWaitingTimeComplete()},this._currentTimeToWait);
            if(this._DevTools.isEnabled()){
                const timeInSeconds = Math.round(this._currentTimeToWait / 1000);
                console.debug("[HzTimeControlComponent] Start waiting. Data:",{
                    timeInPage:pageTime/1000+" seconds",
                    timeToWait:timeInSeconds
                });
                this._initLogger(timeInSeconds,timeInSeconds);
            }
            this._eventEmitter.trigger(HzTimeControlComponent.ON_WAITING_STARTS,[this._currentPage.getPageName(),this._currentTimeToWait]);
            this._eventEmitter.globalEmitter.trigger(HzTimeControlComponent.ON_WAITING_STARTS,[this._currentPage.getPageName(),this._currentTimeToWait]);
        }
    }
    protected _initLogger(pendingSeconds,originalSeconds){
        if(this._debugWaitingTimeInterval){
            clearInterval(this._debugWaitingTimeInterval);
        }
        let counter = 0;
        let that = this;
        const timer = pendingSeconds > 300 ? 60000 :pendingSeconds > 120  ? 30000 : pendingSeconds > 30 ? 10000 : 1000;
        console.debug("[HzTimeControl]",`Waiting ${originalSeconds} seconds, pending ${pendingSeconds}. ${timer > 1000 ? "Next log in " +(timer/1000)+"seconds":""}`);
        this._debugWaitingTimeInterval = setInterval(function(){
            counter+=timer/1000;
            const pending = pendingSeconds-counter;
            if(
                (pending < 300 && pending > 120 && timer > 30000)
                ||
                (pending < 120 && pending > 30 && timer > 10000)
                ||
                (pending < 30 && timer > 1000)
            ){
                that._initLogger(pending,originalSeconds);
            }else{
                console.debug("[HzTimeControl]",`Waiting ${originalSeconds} seconds, pending ${pending}. ${timer > 1000 ? "Next log in " +(timer/1000)+"seconds":""}`);
            }
        },timer);
    }
    protected _onWaitingTimeComplete(){
        this._endWaiting();
        const name = this._currentPage.getPageName();
        let options = this._times.get(name);
        options.completed = true;
        this._times.set(name,options);
        this._Navigator.setNextDisabled(false);
        if(this._DevTools.isEnabled()){
            console.debug(`[HzTimeControlComponent] Process completed. Navigation enabled.`);
        }
        if(this._state.indexOf(name) == -1){
            this._state.push(name);
        }
        let suspendData = this._ScormService.getSuspendData();
        suspendData.tc = this._state;
        this._ScormService.setSuspendData(suspendData);
        const timeToWait = this._currentTimeToWait;
        this._eventEmitter.trigger(HzTimeControlComponent.ON_WAITING_COMPLETE,[name,timeToWait]);
        this._eventEmitter.globalEmitter.trigger(HzTimeControlComponent.ON_WAITING_COMPLETE,[name,timeToWait]);
    }
    protected _startProcess(pageImplementation:PageImplementation){
        this._completeCurrentProcess(this._waiting);
        this._currentPage = pageImplementation;
        const name = pageImplementation.getPageName();
        const options = this._getOptionsForPage(name);
        if(options.weight > 0 && !options.completed){
            this._eventEmitter.trigger(HzTimeControlComponent.ON_PROCESS_STARTS,[this._currentPage.getPageName(),this._currentTimeToWait]);
            this._eventEmitter.globalEmitter.trigger(HzTimeControlComponent.ON_PROCESS_STARTS,[this._currentPage.getPageName(),this._currentTimeToWait]);
            this._dateCurrentPageStart = new Date();
            const pageWeight = this._getCurrentWeight();
            const timeForWeight = Math.round((this._totalTimeInMillis - this._currentSco.getTotalTime(true)) / pageWeight);
            this._currentPageRequiredTime =Math.round(timeForWeight*options.weight);
            if(this._DevTools.isEnabled()){
                console.debug(`[HzTimeControlComponent] Starting process. Data:`,{
                    totalWeight:this._getCurrentWeight(),
                    totalTimeRequired:this._options.time+" minute/s",
                    totalTimeSpend:this._currentSco.getTotalTimeFormatted(true),
                    currentPage:pageImplementation.getPageName(),
                    pageWeight:pageWeight,
                    timeForEachWeight:timeForWeight/1000+" seconds",
                    timeRequiredForPage:this._currentPageRequiredTime/1000+" seconds"
                });
            }
            pageImplementation.getPage().off("." + HzTimeControlComponent.NAMESPACE).on(
                `${PageController.ON_COMPLETE_CHANGE}.${HzTimeControlComponent.NAMESPACE}`,
                {instance: this},
                this._onPageCompleteChange
            );
        }
    }
    protected _completeCurrentProcess(cancelled:boolean = false){
        this._endWaiting();
        this._currentTimeToWait = null;
        if (this._currentPage) {
            this._currentPage.getPage().off("." + HzTimeControlComponent.NAMESPACE)
        }
        if (this._DevTools.isEnabled() && cancelled) {
            console.debug(`[HzTimeControlComponent] Process cancelled`);
        }
        const pageName = this._currentPage ? this._currentPage.getPageName() : "";
        this._currentPageRequiredTime = null;
        this._dateCurrentPageStart = null;
        this._dateCurrentPageEnd = null;
        this._eventEmitter.trigger(HzTimeControlComponent.ON_PROCESS_COMPLETE, [pageName, cancelled]);
        this._eventEmitter.globalEmitter.trigger(HzTimeControlComponent.ON_PROCESS_COMPLETE, [pageName, cancelled]);
    }
    /**
     * Invocado al comenzar el cambio de página.
     * @param e
     * @param newPage
     * @param oldPage
     * @private
     */
    protected _onPageChangeStart(e, newPage: INavigatorPageData, oldPage: INavigatorPageData) {
        let instance = e.data.instance;
        instance._pageChangeCompleted = false;
        let pageImplementation = instance._PageManager.getPage(newPage.index);
        instance._startProcess(pageImplementation);
    }
    /**
     * Invocado al finalizarse el cambio de página.
     * @param e
     * @param newPage
     * @param oldPage
     * @private
     */
    protected _onPageChangeEnd(e, newPage: INavigatorPageData, oldPage: INavigatorPageData) {
        let instance = e.data.instance;
        instance._pageChangeCompleted = true;
        let pageImplementation = instance._Navigator.getCurrentPage(),
            page = pageImplementation.getPage(),
            options = instance._getOptionsForPage(page.getName());
        if(pageImplementation.isCompleted() && instance._currentPageRequiredTime && !options.completed){
            instance._startWaiting();
        }
    }

    /**
     * Invocado al completarse la página. Actualiza el estado del botón siguiente y del % de avance
     * @param e
     * @param completed
     * @private
     */
    protected _onPageCompleteChange(e, completed) {
        if (completed) {
            let instance = e.data.instance;
            instance._dateCurrentPageEnd = new Date();
            let pageImplementation = instance._Navigator.getCurrentPage(),
                options = instance._times.get(pageImplementation.getPageName());
            if(instance._pageChangeCompleted && options.weight > 0 && !options.completed){
                instance._startWaiting();
            }
        }
    }
    public isWaiting(){
        return this._waiting;
    }
    public timeToWait(){
        return this._currentTimeToWait;
    }
    public requiredTimeForPage(){
        return this._currentPageRequiredTime;
    }
    public getTimeWaitedAsMillis(){
        if(this._startWaitingDate) {
            let date = new Date();
            return date.getTime() - this._startWaitingDate.getTime();
        }else{
            return 0;
        }
    }
}