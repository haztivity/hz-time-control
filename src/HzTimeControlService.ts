/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import {Service} from "@haztivity/core";
import {HzTimeControlComponent} from "./HzTimeControlComponent";
@Service(
    {
        name: "HzTimeControlService",
        dependencies:[]
    }
)
export class HzTimeControlService{
    public static readonly ON_PROCESS_COMPLETE = HzTimeControlComponent.ON_PROCESS_COMPLETE;
    public static readonly ON_PROCESS_STARTS = HzTimeControlComponent.ON_PROCESS_STARTS;
    public static readonly ON_WAITING_COMPLETE = HzTimeControlComponent.ON_WAITING_COMPLETE;
    public static readonly ON_WAITING_STARTS = HzTimeControlComponent.ON_WAITING_STARTS;
    constructor(){
        let publish = [
            "isWaiting",
            "timeToWait",
            "requiredTimeForPage",
            "getTimeWaitedAsMillis",
            "on",
            "one",
            "off"
        ];
        if(HzTimeControlComponent.__instance) {
            for (let method of publish) {
                this[method] = HzTimeControlComponent.__instance[method].bind(HzTimeControlComponent.__instance);
            }
        }else{
            console.warn("[HzTimeControlService] Any HzTimeControlComponent available");
        }
    }
    public isWaiting():boolean{
        return undefined;
    }
    public timeToWait():number{
        return undefined;
    }
    public requiredTimeForPage():number{
        return undefined;
    }
    public getTimeWaitedAsMillis():number{
        return undefined;
    }
    /**
     * @see EventEmitter#on
     */
    public on(events: string, data: any, handler: (eventObject: JQueryEventObject, ...args: any[]) => any): Navigator {
        return undefined;
    }

    public one(events: string, data: any, handler: (eventObject: JQueryEventObject) => any): Navigator {
        return undefined;
    }

    public off(events: string, handler?: (eventObject: JQueryEventObject) => any): Navigator {
        return undefined;
    }

}