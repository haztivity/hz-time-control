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
var HzTimeControlComponent_1 = require("./HzTimeControlComponent");
var hz_questions_for_pages_1 = require("@haztivity/hz-questions-for-pages");
var HzTimeControlWithQuestionsPerPageComponent = /** @class */ (function (_super) {
    __extends(HzTimeControlWithQuestionsPerPageComponent, _super);
    function HzTimeControlWithQuestionsPerPageComponent(_$, _EventEmitterFactory, _Navigator, _PageManager, _DataOptions, _ScormService, _DevTools, _HzQuestionsForPagesService) {
        var _this = _super.call(this, _$, _EventEmitterFactory, _Navigator, _PageManager, _DataOptions, _ScormService, _DevTools) || this;
        _this._Navigator = _Navigator;
        _this._PageManager = _PageManager;
        _this._DataOptions = _DataOptions;
        _this._ScormService = _ScormService;
        _this._DevTools = _DevTools;
        _this._HzQuestionsForPagesService = _HzQuestionsForPagesService;
        if (!_HzQuestionsForPagesService.hasInstance()) {
            throw "[HzTimeControlWithQuestionsPerPageComponent] An instance of HzQuestionsForPagesComponent is required";
        }
        return _this;
    }
    HzTimeControlWithQuestionsPerPageComponent.prototype._startWaiting = function () {
        var result = _super.prototype._startWaiting.call(this);
        if (result) {
            this._HzQuestionsForPagesService.start();
        }
        return result;
    };
    HzTimeControlWithQuestionsPerPageComponent.prototype._endWaiting = function () {
        _super.prototype._endWaiting.call(this);
        this._HzQuestionsForPagesService.stop();
    };
    HzTimeControlWithQuestionsPerPageComponent._DEFAULTS = {
        scale: false
    };
    HzTimeControlWithQuestionsPerPageComponent = __decorate([
        core_1.Component({
            name: "HzTimeControlWithQuestionsPerPage",
            dependencies: [
                core_1.$,
                core_1.EventEmitterFactory,
                core_1.Navigator,
                core_1.PageManager,
                core_1.DataOptions,
                core_1.ScormService,
                core_1.DevTools,
                hz_questions_for_pages_1.HzQuestionsForPagesService
            ]
        })
    ], HzTimeControlWithQuestionsPerPageComponent);
    return HzTimeControlWithQuestionsPerPageComponent;
}(HzTimeControlComponent_1.HzTimeControlComponent));
exports.HzTimeControlWithQuestionsPerPageComponent = HzTimeControlWithQuestionsPerPageComponent;
//# sourceMappingURL=HzTimeControlWithQuestionsPerPageComponent.js.map