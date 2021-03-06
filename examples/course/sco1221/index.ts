/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import template from "./sco.pug";
import "./main.scss";
import "./markdown.scss";
import "./prism-github.scss";
import "jquery-ui-dist/jquery-ui.structure.css";
import "jquery-ui-dist/jquery-ui.theme.css";
import {ScoFactory, Sco, ISco} from "@haztivity/core";
import {HzQuestionsForPagesComponent} from "@haztivity/hz-questions-for-pages";
import {HzTimeControlQuestionsComponent} from "../components/hz-time-control/HzTimeControl";
import {HzNavbarComponent} from "@haztivity/hz-navbar";
import {page as page6611} from "./pages/6611/page";
import {page as page6612} from "./pages/6612/page";
import {page as page6613} from "./pages/6613/page";
let sco: ISco = ScoFactory.createSco(
    {
        name: "1221",
        template:template,
        pages: [
            page6611,
            page6612,
            page6613
        ],
        components: [
            HzNavbarComponent,
            HzQuestionsForPagesComponent,
            HzTimeControlQuestionsComponent
        ]
    }
);
sco.run();
