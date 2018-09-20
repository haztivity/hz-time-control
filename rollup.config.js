import typescript from 'rollup-plugin-typescript';
import uglify from 'rollup-plugin-uglify';
import uglifyEs from 'rollup-plugin-uglify-es';
import license from 'rollup-plugin-license';
import {name} from "./package.json";
import camelCase from "lodash.camelCase";
const src = "./src/index.ts",
    fileName=name.replace(/@.*\//,""),
    packageName =camelCase(name),
    banner=`@license ${fileName} v<%= pkg.version %>
(c) <%= moment().format('YYYY') %> <%= pkg.author %>, Inc.
License <%= pkg.license %>
`;
export default [
    {
        input: src,
        output: {
            file: `dist/${fileName}.js`,
            name:packageName,
            format: 'umd'
        },
        plugins: [
            typescript({
                typescript:require("typescript")
            }),
            license({
                banner:banner
            })
        ]
    },
    //min
    {
        input: src,
        output: {
            file: `dist/${fileName}.min.js`,
            name:packageName,
            format: 'umd'
        },
        plugins: [
            typescript({
                typescript:require("typescript")
            }),
            uglify(),
            license({
                banner:banner
            })
        ]
    },
    //esm2015
    {
        input: src,
        output: {
            file: `esm2015/${fileName}.js`,
            name:packageName,
            format: 'umd'
        },
        plugins: [
            typescript({
                typescript:require("typescript"),
                target:"es2015"
            }),
            license({
                banner:banner
            })
        ]
    },
    //esm2015 min
    {
        input: src,
        output: {
            file: `esm2015/${fileName}.min.js`,
            name:packageName,
            format: 'umd'
        },
        plugins: [
            typescript({
                typescript:require("typescript"),
                target:"es2015"
            }),
            uglifyEs(),
            license({
                banner:banner
            })
        ]
    },
]