"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@haztivity/core");
var moment = require("moment");
var HzTimeControlComponent = /** @class */ (function (_super) {
    __extends(HzTimeControlComponent, _super);
    function HzTimeControlComponent(_$, _EventEmitterFactory, _Navigator, _PageManager, _DataOptions, _ScormService, _DevTools) {
        var _this = _super.call(this, _$, _EventEmitterFactory) || this;
        _this._Navigator = _Navigator;
        _this._PageManager = _PageManager;
        _this._DataOptions = _DataOptions;
        _this._ScormService = _ScormService;
        _this._DevTools = _DevTools;
        _this._currentSco = core_1.ScoFactory.getCurrentSco();
        _this._times = new Map();
        if (HzTimeControlComponent_1.__instance) {
            throw "[HzTimeControlComponent] There must be only one component of HzTimeControl";
        }
        HzTimeControlComponent_1.__instance = _this;
        _this._$("body").addClass(HzTimeControlComponent_1.CLASS_COMPONENT);
        return _this;
    }
    HzTimeControlComponent_1 = HzTimeControlComponent;
    HzTimeControlComponent.prototype.init = function (options, config) {
        this._options = core_1.$.extend(true, {}, HzTimeControlComponent_1._DEFAULTS, options);
        if (this._options.time == undefined) {
            throw "[HzTimeControlComponent] The option 'time' is mandatory";
        }
        this._options.time = Math.round(this._options.time);
        this._totalTimeInMillis = this._options.time * 60000;
        var state = [];
        if (this._ScormService.LMSIsInitialized()) {
            var data = this._ScormService.doLMSGetValue("cmi.suspend_data");
            if (data) {
                try {
                    state = JSON.parse(data).tc || [];
                }
                catch (e) {
                    state = [];
                }
            }
        }
        this._state = state;
        //map times
        if (this._options.times) {
            for (var time in this._options.times) {
                var options_1 = this._options.times[time];
                options_1.weight = options_1.weight != undefined ? Math.round(options_1.weight) : 1;
                options_1.completed = state.indexOf(time) != -1;
                this._times.set(time, options_1);
            }
        }
        //get the weights from pages and set into options
        var pages = this._PageManager.getPages();
        for (var _i = 0, pages_1 = pages; _i < pages_1.length; _i++) {
            var pageImplementation = pages_1[_i];
            var options_2 = pageImplementation.getPage().getOptions().timeControl || {};
            var name_1 = pageImplementation.getPageName();
            var options2 = this._options.times[name_1] || {};
            options_2 = this._$.extend(true, { weight: 1 }, options2, options_2);
            options_2.completed = state.indexOf(name_1) != -1;
            this._times.set(name_1, options_2);
        }
        if (this._options.waitingEnd) {
            this._$message = this._$(this._options.waitingEnd);
            this._$message.hide();
        }
        if (this._options.progressBar) {
            this._$progressBar = this._$(this._options.progressBar);
            if (this._$progressBar.length > 0) {
                this._$progressBar.progressbar(this._options.progressbar);
                this._progressBar = this._$progressBar.progressbar("instance");
            }
        }
        if (this._options.progressTime) {
            this._$progressTime = this._$(this._options.progressTime);
        }
        this._assignEvents();
    };
    /**
     * Asigna los handlers a eventos
     * @protected
     */
    HzTimeControlComponent.prototype._assignEvents = function () {
        this._eventEmitter.globalEmitter.on(core_1.ScoController.ON_BEFORE_EXIT, { instance: this }, this._onScoExit);
        this._Navigator.on(core_1.Navigator.ON_CHANGE_PAGE_START, { instance: this }, this._onPageChangeStart);
        this._Navigator.on(core_1.Navigator.ON_CHANGE_PAGE_END, { instance: this }, this._onPageChangeEnd);
        this._Navigator.on(core_1.Navigator.ON_NEXT_ENABLE, { instance: this }, this._onNavigatorEnabled);
    };
    HzTimeControlComponent.prototype._onScoExit = function (e) {
        var instance = e.data.instance;
        instance._completeCurrentProcess(true);
    };
    HzTimeControlComponent.prototype._getOptionsForPage = function (pageName) {
        return this._times.get(pageName);
    };
    HzTimeControlComponent.prototype._getCurrentWeight = function (slope) {
        if (slope === void 0) { slope = 0; }
        var pages = this._PageManager.getPages(), weight = 0;
        for (var pageIndex = 0, pagesLength = pages.length; pageIndex < pagesLength; pageIndex++) {
            var pageImplementation = pages[pageIndex];
            var options = this._getOptionsForPage(pageImplementation.getPageName());
            if (!options.completed) {
                weight += ((slope * (pageIndex)) + 1) * options.weight;
            }
        }
        return weight;
    };
    HzTimeControlComponent.prototype._onNavigatorEnabled = function (e) {
        var instance = e.data.instance;
        if (instance._waiting) {
            instance._Navigator.setNextDisabled(true);
        }
    };
    HzTimeControlComponent.prototype._endWaiting = function () {
        this._waiting = false;
        if (this._currentWaitTimeout) {
            clearTimeout(this._currentWaitTimeout);
            this._currentWaitTimeout = null;
        }
        if (this._debugWaitingTimeInterval) {
            clearInterval(this._debugWaitingTimeInterval);
            this._debugWaitingTimeInterval = null;
        }
        if (this._progressBarInterval) {
            clearInterval(this._progressBarInterval);
            this._progressBarInterval = null;
        }
        this._startWaitingDate = null;
        this._startWaitingMoment = null;
        this._currentTimeToWait = null;
        this._$("body").removeClass(HzTimeControlComponent_1.CLASS_WAITING);
    };
    HzTimeControlComponent.prototype._startWaiting = function () {
        var result = false;
        if (!this._waiting) {
            this._waiting = true;
            this._$("body").addClass(HzTimeControlComponent_1.CLASS_WAITING);
            this._Navigator.setNextDisabled(true);
            var pageTime = (this._dateCurrentPageEnd ? this._dateCurrentPageEnd.getTime() : new Date().getTime()) - this._dateCurrentPageStart.getTime(), timeToWait = Math.round(this._currentPageRequiredTime - pageTime);
            this._currentTimeToWait = timeToWait >= 2000 ? timeToWait : 2000;
            this._startWaitingDate = new Date();
            this._startWaitingMoment = moment(this._startWaitingDate);
            var that_1 = this;
            this._currentWaitTimeout = setTimeout(function () { that_1._onWaitingTimeComplete(); }, this._currentTimeToWait);
            if (this._DevTools.isEnabled()) {
                var timeInSeconds = Math.round(this._currentTimeToWait / 1000);
                console.debug("[HzTimeControlComponent] Start waiting. Data:", {
                    timeInPage: pageTime / 1000 + " seconds",
                    timeToWait: timeInSeconds
                });
                this._initLogger(timeInSeconds, timeInSeconds);
            }
            if (this._progressBar) {
                var that_2 = this;
                this._updateProgress();
                this._progressBarInterval = setInterval(function () {
                    that_2._updateProgress();
                }, 1000);
            }
            this._eventEmitter.trigger(HzTimeControlComponent_1.ON_WAITING_STARTS, [this._currentPage.getPageName(), this._currentTimeToWait]);
            this._eventEmitter.globalEmitter.trigger(HzTimeControlComponent_1.ON_WAITING_STARTS, [this._currentPage.getPageName(), this._currentTimeToWait]);
            return true;
        }
        return result;
    };
    HzTimeControlComponent.prototype._updateProgress = function () {
        var now = new Date();
        var timeWaited = moment(now).diff(this._startWaitingMoment);
        var timeLeft = this._currentTimeToWait - timeWaited;
        var progress;
        if (timeLeft >= 1000) {
            progress = parseFloat(((timeWaited * 100) / this._currentTimeToWait).toFixed(2));
        }
        else {
            progress = 100;
        }
        this._$progressBar.progressbar("option", "value", progress);
        if (this._$progressTime.length > 0 && timeLeft > 0) {
            this._$progressTime.text(moment(timeLeft).format("mm:ss"));
        }
    };
    HzTimeControlComponent.prototype._initLogger = function (pendingSeconds, originalSeconds) {
        if (this._debugWaitingTimeInterval) {
            clearInterval(this._debugWaitingTimeInterval);
        }
        var counter = 0;
        var that = this;
        var timer = pendingSeconds > 300 ? 60000 : pendingSeconds > 120 ? 30000 : pendingSeconds > 30 ? 10000 : 1000;
        console.debug("[HzTimeControl]", "Waiting " + originalSeconds + " seconds, pending " + pendingSeconds + ". " + (timer > 1000 ? "Next log in " + (timer / 1000) + "seconds" : ""));
        this._debugWaitingTimeInterval = setInterval(function () {
            counter += timer / 1000;
            var pending = pendingSeconds - counter;
            if ((pending < 300 && pending > 120 && timer > 30000)
                ||
                    (pending < 120 && pending > 30 && timer > 10000)
                ||
                    (pending < 30 && timer > 1000)) {
                that._initLogger(pending, originalSeconds);
            }
            else {
                console.debug("[HzTimeControl]", "Waiting " + originalSeconds + " seconds, pending " + pending + ". " + (timer > 1000 ? "Next log in " + (timer / 1000) + "seconds" : ""));
            }
        }, timer);
    };
    HzTimeControlComponent.prototype._onWaitingTimeComplete = function () {
        this._endWaiting();
        if (this._$message) {
            this._$message.show();
        }
        var name = this._currentPage.getPageName();
        var options = this._times.get(name);
        options.completed = true;
        this._times.set(name, options);
        this._Navigator.setNextDisabled(false);
        if (this._DevTools.isEnabled()) {
            console.debug("[HzTimeControlComponent] Process completed. Navigation enabled.");
        }
        if (this._state.indexOf(name) == -1) {
            this._state.push(name);
        }
        var suspendData = this._ScormService.getSuspendData();
        suspendData.tc = this._state;
        this._ScormService.setSuspendData(suspendData);
        var timeToWait = this._currentTimeToWait;
        this._eventEmitter.trigger(HzTimeControlComponent_1.ON_WAITING_COMPLETE, [name, timeToWait]);
        this._eventEmitter.globalEmitter.trigger(HzTimeControlComponent_1.ON_WAITING_COMPLETE, [name, timeToWait]);
    };
    HzTimeControlComponent.prototype._startProcess = function (pageImplementation) {
        this._completeCurrentProcess(this._waiting);
        this._currentPage = pageImplementation;
        var name = pageImplementation.getPageName();
        var options = this._getOptionsForPage(name);
        debugger;
        if (options.weight > 0 && !options.completed) {
            this._eventEmitter.trigger(HzTimeControlComponent_1.ON_PROCESS_STARTS, [this._currentPage.getPageName(), this._currentTimeToWait]);
            this._eventEmitter.globalEmitter.trigger(HzTimeControlComponent_1.ON_PROCESS_STARTS, [this._currentPage.getPageName(), this._currentTimeToWait]);
            this._dateCurrentPageStart = new Date();
            var courseTotalTime = 0; //this._currentSco.getTotalTime(true);
            var totalWeight = this._getCurrentWeight(this._options.slope);
            var timeForWeight = Math.round((this._totalTimeInMillis - courseTotalTime) / totalWeight);
            var pageWeight = ((this._options.slope * this._Navigator.getCurrentPageIndex()) + 1) * options.weight;
            this._currentPageRequiredTime = Math.round(timeForWeight * pageWeight);
            if (this._DevTools.isEnabled()) {
                var devWeight = this._getCurrentWeight();
                var devTime = Math.round((this._totalTimeInMillis - courseTotalTime) / devWeight);
                console.debug("[HzTimeControlComponent] Starting process. Data:", {
                    totalWeight: devWeight,
                    totalWeightWithSlope: totalWeight,
                    totalTimeRequired: this._options.time + " minute/s",
                    totalTimeSpend: this._currentSco.getTotalTimeFormatted(true),
                    currentPage: pageImplementation.getPageName(),
                    pageIndex: this._Navigator.getCurrentPageIndex(),
                    pageWeight: options.weight,
                    pageWeightWithSlope: pageWeight,
                    timeForEachWeight: devTime / 1000 + " seconds",
                    timeForEachWeightWithSlope: timeForWeight / 1000 + " seconds",
                    timeRequiredForPage: Math.round(devTime * options.weight) / 1000 + " seconds",
                    timeRequiredForPageWithSlope: this._currentPageRequiredTime / 1000 + " seconds"
                });
            }
            pageImplementation.getPage().off("." + HzTimeControlComponent_1.NAMESPACE).on(core_1.PageController.ON_COMPLETE_CHANGE + "." + HzTimeControlComponent_1.NAMESPACE, { instance: this }, this._onPageCompleteChange);
        }
    };
    HzTimeControlComponent.prototype._completeCurrentProcess = function (cancelled) {
        if (cancelled === void 0) { cancelled = false; }
        this._endWaiting();
        this._currentTimeToWait = null;
        if (this._$message) {
            this._$message.hide();
        }
        if (this._currentPage) {
            this._currentPage.getPage().off("." + HzTimeControlComponent_1.NAMESPACE);
        }
        if (this._DevTools.isEnabled() && cancelled) {
            console.debug("[HzTimeControlComponent] Process cancelled");
        }
        var pageName = this._currentPage ? this._currentPage.getPageName() : "";
        this._currentPageRequiredTime = null;
        this._dateCurrentPageStart = null;
        this._dateCurrentPageEnd = null;
        this._eventEmitter.trigger(HzTimeControlComponent_1.ON_PROCESS_COMPLETE, [pageName, cancelled]);
        this._eventEmitter.globalEmitter.trigger(HzTimeControlComponent_1.ON_PROCESS_COMPLETE, [pageName, cancelled]);
    };
    /**
     * Invocado al comenzar el cambio de página.
     * @param e
     * @param newPage
     * @param oldPage
     * @private
     */
    HzTimeControlComponent.prototype._onPageChangeStart = function (e, newPage, oldPage) {
        var instance = e.data.instance;
        instance._pageChangeCompleted = false;
        var pageImplementation = instance._PageManager.getPage(newPage.index);
        instance._startProcess(pageImplementation);
    };
    /**
     * Invocado al finalizarse el cambio de página.
     * @param e
     * @param newPage
     * @param oldPage
     * @private
     */
    HzTimeControlComponent.prototype._onPageChangeEnd = function (e, newPage, oldPage) {
        var instance = e.data.instance;
        instance._pageChangeCompleted = true;
        var pageImplementation = instance._Navigator.getCurrentPage(), page = pageImplementation.getPage(), options = instance._getOptionsForPage(page.getName());
        if (pageImplementation.isCompleted() && instance._currentPageRequiredTime && !options.completed) {
            instance._startWaiting();
        }
    };
    /**
     * Invocado al completarse la página. Actualiza el estado del botón siguiente y del % de avance
     * @param e
     * @param completed
     * @private
     */
    HzTimeControlComponent.prototype._onPageCompleteChange = function (e, completed) {
        if (completed) {
            var instance = e.data.instance;
            instance._dateCurrentPageEnd = new Date();
            var pageImplementation = instance._Navigator.getCurrentPage(), options = instance._times.get(pageImplementation.getPageName());
            if (instance._pageChangeCompleted && options.weight > 0 && !options.completed) {
                instance._startWaiting();
            }
        }
    };
    HzTimeControlComponent.prototype.isWaiting = function () {
        return this._waiting;
    };
    HzTimeControlComponent.prototype.timeToWait = function () {
        return this._currentTimeToWait;
    };
    HzTimeControlComponent.prototype.requiredTimeForPage = function () {
        return this._currentPageRequiredTime;
    };
    HzTimeControlComponent.prototype.getTimeWaitedAsMillis = function () {
        if (this._startWaitingDate) {
            var date = new Date();
            return date.getTime() - this._startWaitingDate.getTime();
        }
        else {
            return 0;
        }
    };
    var HzTimeControlComponent_1;
    HzTimeControlComponent.NAMESPACE = "hzTimeControl";
    HzTimeControlComponent.PREFIX = "hz-time-control";
    HzTimeControlComponent.ON_PROCESS_STARTS = HzTimeControlComponent_1.NAMESPACE + ":process-start";
    HzTimeControlComponent.ON_PROCESS_COMPLETE = HzTimeControlComponent_1.NAMESPACE + ":process-complete";
    HzTimeControlComponent.ON_WAITING_STARTS = HzTimeControlComponent_1.NAMESPACE + ":waitingstarts";
    HzTimeControlComponent.ON_WAITING_COMPLETE = HzTimeControlComponent_1.NAMESPACE + ":waitingcomplete";
    HzTimeControlComponent.CLASS_WAITING = "hz-time-control__waiting";
    HzTimeControlComponent.CLASS_COMPONENT = "hz-time-control";
    HzTimeControlComponent._DEFAULTS = {
        slope: 0,
        progressbar: {}
    };
    HzTimeControlComponent = HzTimeControlComponent_1 = __decorate([
        core_1.Component({
            name: "HzTimeControl",
            dependencies: [
                core_1.$,
                core_1.EventEmitterFactory,
                core_1.Navigator,
                core_1.PageManager,
                core_1.DataOptions,
                core_1.ScormService,
                core_1.DevTools
            ]
        })
    ], HzTimeControlComponent);
    return HzTimeControlComponent;
}(core_1.ComponentController));
exports.HzTimeControlComponent = HzTimeControlComponent;
//# sourceMappingURL=HzTimeControlComponent.js.map