/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import * as Prism "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-pug";
import {PageFactory, PageRegister, PageController,ScoFactory} from "@haztivity/core";
import template from "./page.pug";
export let page: PageRegister = PageFactory.createPage(
    {
        title: "Theme mixin",
        name: "6613",
        resources: [],
        template: template
    }
);
page.on(
    PageController.ON_SHOW, null, (eventObject, $page, $oldPage, oldPageRelativePosition, pageController) => {
        Prism.highlightAll(false);
        console.log(ScoFactory.getCurrentSco().getTotalTimeFormatted(true));
    }
);