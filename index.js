const { createFilter } = require('rollup-pluginutils');
const cspHtmlLinter = require('csp-html-linter');
let violations = [];

function resetViolations() {
  violations = [];
}
function rollupCspHtmlLinter(options = {}) {
  const filter = createFilter(options.include || '**/*.html', options.exclude);

  return {
    name: 'rollup-csp-html-linter',

    async transform(code, id) {
      if (!filter(id)) {
        return null;
      }

      if (id.indexOf('.html') >= -1) {
        let result = cspHtmlLinter.parse(code, options);
        if (result.length > 0) {
          violations = violations.concat(mapViolations(result, id));
        }
      }
    },
    buildEnd() {
      if (violations.length > 0) {
        let result = (violations.map(v => `${v.violation}\n${v.file}`)).join('\n');
        throw Error(`CSP Violations were found. \n${result} `);
      }
    }
  };
};

function mapViolations(messages, id) {
  let violations = [];
  messages.forEach((v) => {
    violations.push({ file: id, violation: v });
  });

  return violations;
}

module.exports = { rollupCspHtmlLinter, resetViolations };