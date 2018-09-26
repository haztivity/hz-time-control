"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
var core_1 = require("@haztivity/core");
var HzTimeControlComponent_1 = require("./HzTimeControlComponent");
var HzTimeControlService = /** @class */ (function () {
    function HzTimeControlService() {
        var publish = [
            "isWaiting",
            "timeToWait",
            "requiredTimeForPage",
            "getTimeWaitedAsMillis",
            "on",
            "one",
            "off"
        ];
        if (HzTimeControlComponent_1.HzTimeControlComponent.__instance) {
            for (var _i = 0, publish_1 = publish; _i < publish_1.length; _i++) {
                var method = publish_1[_i];
                this[method] = HzTimeControlComponent_1.HzTimeControlComponent.__instance[method].bind(HzTimeControlComponent_1.HzTimeControlComponent.__instance);
            }
        }
        else {
            console.warn("[HzTimeControlService] Any HzTimeControlComponent available");
        }
    }
    HzTimeControlService.prototype.isWaiting = function () {
        return undefined;
    };
    HzTimeControlService.prototype.timeToWait = function () {
        return undefined;
    };
    HzTimeControlService.prototype.requiredTimeForPage = function () {
        return undefined;
    };
    HzTimeControlService.prototype.getTimeWaitedAsMillis = function () {
        return undefined;
    };
    /**
     * @see EventEmitter#on
     */
    HzTimeControlService.prototype.on = function (events, data, handler) {
        return undefined;
    };
    HzTimeControlService.prototype.one = function (events, data, handler) {
        return undefined;
    };
    HzTimeControlService.prototype.off = function (events, handler) {
        return undefined;
    };
    HzTimeControlService.ON_PROCESS_COMPLETE = HzTimeControlComponent_1.HzTimeControlComponent.ON_PROCESS_COMPLETE;
    HzTimeControlService.ON_PROCESS_STARTS = HzTimeControlComponent_1.HzTimeControlComponent.ON_PROCESS_STARTS;
    HzTimeControlService.ON_WAITING_COMPLETE = HzTimeControlComponent_1.HzTimeControlComponent.ON_WAITING_COMPLETE;
    HzTimeControlService.ON_WAITING_STARTS = HzTimeControlComponent_1.HzTimeControlComponent.ON_WAITING_STARTS;
    HzTimeControlService = __decorate([
        core_1.Service({
            name: "HzTimeControlService",
            dependencies: []
        })
    ], HzTimeControlService);
    return HzTimeControlService;
}());
exports.HzTimeControlService = HzTimeControlService;
//# sourceMappingURL=HzTimeControlService.js.map