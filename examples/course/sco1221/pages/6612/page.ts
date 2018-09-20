/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import * as Prism "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-pug";
import {HzTooltipResource} from "@haztivity/hz-tooltip";
import {PageFactory, PageRegister, PageController, NavigatorService} from "@haztivity/core";
import  template from "./page.pug";
import {HzTimeControlService} from "../../../components/hz-time-control/HzTimeControl";

export let page: PageRegister = PageFactory.createPage(
    {
        title: "Manipulation",
        name: "6612",
        resources: [
            HzTooltipResource
        ],
        template: template
    }
);
page.on(
    PageController.ON_SHOW, null, (eventObject, $page, $oldPage, oldPageRelativePosition, pageController) => {
        Prism.highlightAll(false);

        const service = pageController.InjectorService.get(HzTimeControlService);
        service.on(HzTimeControlService.ON_WAITING_STARTS+".page",function(){
            console.log(`Page ${page.getName()} is waiting`)
        });
        service.on(HzTimeControlService.ON_WAITING_STARTS+".page",function(){
            console.log(`Page ${page.getName()} waiting ends`)
        });

    }
);
page.on(
    PageController.ON_DESTROY, null, (eventObject, $page, pageController) => {
        const service = pageController.InjectorService.get(HzTimeControlService);
        service.off(".page");
    }
)