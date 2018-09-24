# hz-timecontrol
 HzTimeControl allows to "require" the user to spend a certain time in the pages by disabling the navigation until the specified time passes.

## Install
### NPM
```npm i --save @haztivity/hz-time-control```
## Dependencies
- @haztivity/core

## Usage
1. Import @haztivity/hz-time-control
2. Add HzTimeControl to the sco
3. Set ```data-hz-component="HzTimeControl"```
### Ts
```typescript
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import template from "./sco.pug";
import "./main.scss";
import "./markdown.scss";
import "./prism-github.scss";
import {ScoFactory, Sco, ISco} from "@haztivity/core";
import {HzTimeControlComponent} from "../components/hz-time-control/HzTimeControlComponent";
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
            HzTimeControlComponent
        ]
    }
);
sco.run();

```
### Pug
```pug
include node:@haztivity/hz-navbar/src/_hzNavbar
div(data-hz-pages)
-
    let times = {
        "6611":{
            "weight":1
        },
        "6612":{
            "weight":1
        },
        "6613":{
            "weight":0
        }
    }
div(data-hz-component="HzTimeControl", data-opt-hz-time-control-time="1", data-opt-hz-time-control-times=times)
+hz-navbar

```
## Options
### options
All the options of hz-time-control could be specified by attributes using:

```pug
    data-opt-hz-time-control-[option]=[value]
```

