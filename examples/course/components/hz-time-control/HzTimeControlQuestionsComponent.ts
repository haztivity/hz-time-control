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
import {HzQuestionsForPagesService} from "@haztivity/hz-questions-for-pages";
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
        scale:false
    };
    constructor(_$: JQueryStatic, _EventEmitterFactory, protected _Navigator: Navigator, protected _PageManager: PageManager, protected _DataOptions, protected _ScormService, protected _DevTools, protected _HzQuestionsForPagesService) {
        super(_$, _EventEmitterFactory, _Navigator,  _PageManager, _DataOptions,  _ScormService,  _DevTools);
        if(!_HzQuestionsForPagesService.hasInstance()){
            throw "[HzTimeControlQuestionsComponent] An instance of HzQuestionsForPagesComponent is required";
        }
    }

    _startWaiting(){
        let result = super._startWaiting();
        if(result){
            this._HzQuestionsForPagesService.start();
        }
        return result;
    }
    _endWaiting(){
        super._endWaiting();
    }

}