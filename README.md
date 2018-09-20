# hz-crossword
hz-crossword is an haztivity resource wrapper for jq-crossword

hz-crossword uses [jq-crossword](https://github.com/davinchi-finsi/jq-crossword) under the hood.
## Install
### NPM
```npm i --save @haztivity/hz-crossword```
## Dependencies
- JQuery
- jq-crossword
- @haztivity/core

## Usage
1. Import @haztivity/hz-crossword
2. Add HzCrossword to the page
3. Set ```data-hz-resource="HzCrossword"```
### Ts
```typescript
import {PageFactory, Page, PageController, PageRegister} from "@haztivity/core";
import template from "./page.pug";
import {HzCrosswordResource} from "@haztivity/hz-crossword";
export let page: PageRegister = PageFactory.createPage(
    {
        name: "myPage",
        resources: [
            HzCrosswordResource
        ],
        template: template
    }
);
```
### Pug
```pug
div
    -
       var definition = {
           "height":8,//height of the board, 8 cells
           "width":5,//width of the board, 5 cells
           "acrossClues":[
               {
                   "number":1, //number to identify the world, must be unique
                   "x":1,//The x position where the word starts, starting from 1
                   "y":2,//The y position where the word starts, starting from 1
                   "answer":"Hello",//the word itself
                   "clue":"A common greeting",//the clue
                   "hints":[2],//the letter 'e' is a hint. Starting from 1
               },
               {
                   "number":2,
                   "x":3,
                   "y":5,
                   "answer":"Old",
                   "clue":"Having lived for a long time; no longer young."
               }
           ],
           "downClues":[
               {
                   "number":1,//this clue starts in the same cell that "Hello", so it must have the same number
                   "x":1,
                   "y":2,
                   "answer":"History",
                   "clue":"The study of past events, particularly in human affairs.",
                   "hints":[2,7]
               },
               {
                   "number":3,
                   "x":5,
                   "y":1,
                   "answer":"World",
                   "clue":"The earth is our _____"
               }
           ]
       }
    div(data-hz-resource="HzCrossword", data-opt-jq-crossword-definition=definition)

```
## Options
### jq-crossword options
All the options of jq-crossword **except** functions could be specified by attributes using:

```pug
    data-opt-jq-crossword-[option]=[value]
```

If the option have multiple words, use dashes, for example ```acrossListTitle``` have to be provided as ```across-list-title```

For more info please visit [jq-crossword](https://github.com/davinchi-finsi/jq-crossword)
