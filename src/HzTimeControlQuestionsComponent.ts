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
import {HzTimeControlComponent} from "./HzTimeControlComponent";
import {HzQuestionsForPagesService,HzQuestionsForPagesComponent} from "@haztivity/hz-questions-for-pages";
@Component(
    {
        name: "HzTimeControlQuestions",
        dependencies: [
            $,
            EventEmitterFactory,
            Navigator,
            PageManager,
            DataOptions,
            ScormService,
            DevTools,
            HzQuestionsForPagesService
        ]
    }
)
export class HzTimeControlQuestionsComponent extends HzTimeControlComponent {
    protected static __instance;
    protected static readonly _DEFAULTS = {
        autoOpen:true,
        autoOpenDelay:500
    };
    constructor(_$: JQueryStatic, _EventEmitterFactory, protected _Navigator: Navigator, protected _PageManager: PageManager, protected _DataOptions, protected _ScormService, protected _DevTools, protected _HzQuestionsForPagesService) {
        super(_$, _EventEmitterFactory, _Navigator,  _PageManager, _DataOptions,  _ScormService,  _DevTools);
        if(!_HzQuestionsForPagesService.hasInstance()){
            throw "[HzTimeControlQuestionsComponent] An instance of HzQuestionsForPagesComponent is required";
        }
    }
    init(options, config?) {
        options = $.extend(true, {}, HzTimeControlQuestionsComponent._DEFAULTS, options);
        super.init(options,config);
        let pages = Array.from(this._times.values());
        for(let page of pages){
            page.autoOpen = page.autoOpen || options.autoOpen;
            page.autoOpenDelay = page.autoOpenDelay || options.autoOpenDelay;
        }
    }
    _assignEvents(){
        super._assignEvents();
        this._HzQuestionsForPagesService.on(HzQuestionsForPagesComponent.ON_TOGGLER_ENABLED,{instance:this},this._onTogglerEnabled);
    }
    _onTogglerEnabled(e,component,disabled){
        let instance = e.data.instance;
        if(!instance.isWaiting()){
            instance._HzQuestionsForPagesService.disableToggler();
        }
    }
    _startWaiting(){
        let result = super._startWaiting();
        if(result){
            this._HzQuestionsForPagesService.enableToggler();
            const options = this._getOptionsForPage(this._currentPage.getPageName());
            if(options.autoOpen) {
                const that = this;
                setTimeout(function(){
                    that._HzQuestionsForPagesService.start();
                },options.autoOpenDelay || 0);
            }
        }
        return result;
    }
    _endWaiting(){
        super._endWaiting();
        //this._HzQuestionsForPagesService.disableToggler();
    }

}