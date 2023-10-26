const { createFilter } = require('rollup-pluginutils');
const cspHtmlLinter = require('csp-html-linter');

module.exports = function cspHtmlLint(options = {}) {
  const filter = createFilter(options.include || '**/*.html', options.exclude);
  let violations = [];

  return {
    name: 'rollup-csp-html-linter',

    async transform(code, id) {
      if (!filter(id)) {
        return null;
      }

      if (id.indexOf('.html') >= -1) {
        violations = cspHtmlLinter.parse(code, options);
      }
    },
    buildEnd() {
      if (violations.length > 0) {
        throw Error(`CSP Violations were found. \n${violations.join('\n')}`);
      }
    }
  };
};