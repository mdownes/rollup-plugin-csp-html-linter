### rollup-plugin-csp-html-linter
A Rollup plugin designed to analyze HTML and identify potential breaches of Content Security Policy (CSP) rules. The goal is to prevent CSP violations from infiltrating your codebase during the build process. This plugin is based on the [csp-html-linter](https://www.npmjs.com/package/csp-html-linter) package.
### Install

Using npm:

```npm install rollup-plugin-csp-html-linter --save-dev```

### Basic Usage

By default this plugin is strict, to reduce the most common XSS attack vectors. 

Create a rollup.config.js configuration file and import the plugin:

```
import { rollupCspHtmlLinter } from 'rollup-plugin-csp-html-linter';

export default {
    input: 'src/index.js',
    output: {
        file: 'bundle.js',
        format: 'esm'
    },
    plugins: [
         rollupCspHtmlLinter({include: '**/*.html'}),
    ],
}
```
### Advanced Usage 

Create a rollup.config.js configuration file and import the plugin:

```
import { rollupCspHtmlLinter } from 'rollup-plugin-csp-html-linter';

export default {
    input: 'src/index.js',
    output: {
        file: 'bundle.js',
        format: 'esm'
    },
    plugins: [
         rollupCspHtmlLinter({
            include: '**/*.html', 
            allowInlineStyles: true,
            allowInlineJs: true,
            allowStyleTagWithoutNonce: true,
            allowScriptTagWithoutNonce: true
        })
    ],
    //other plugins go here
}
```

The configuration above will allow all violations.

### Options

See [csp-html-linter](https://www.npmjs.com/package/csp-html-linter) package for details.