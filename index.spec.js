const { expect } = require('chai');
const { rollupCspHtmlLinter, resetViolations } = require('./index');


let mockCreateFilterValue = true;
jest.mock('rollup-pluginutils', () => ({
  createFilter: jest.fn().mockReturnValue(() => mockCreateFilterValue) // Mock createFilter to always return a filter that includes all files
}));

describe('rollup-plugin-csp-html-linter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetViolations();
  });

  it('should throw an error for all selectors', async () => {
    const inputHTML = `
      <html>
        <head>
          <style>.someClass{
            color:blue;
          }</style>
          <script src="invalid.js"></script>
        </head>
        <body>
        <div style="color:black;">inlinestyle</div>
          <a href="javascript:alert('Hello, World!')">Link</a>
          <iframe src="javascript:alert('Hello, World!')"></iframe>
          <div onclick="doSomething()"></div>
        </body>
      </html>
    `;
    const options = {
      include: '**/*.html',
      exclude: 'exclude.html',
    };
    const code = inputHTML;
    const id = 'example.html';

    try {
      const plugin = rollupCspHtmlLinter(options);
      await plugin.transform(code, id);
      plugin.buildEnd();
    } catch (error) {
      const errorMessage = error.message;
      expect(errorMessage.indexOf('onclick') >= 0).to.be.true;
      expect(errorMessage.indexOf('javascript:') >= 0).to.be.true;
      expect(errorMessage.indexOf('You must not use inline styles') >= 0).to.be.true;
      expect(errorMessage.indexOf('You must add a nonce to a style tag') >= 0).to.be.true;
      expect(errorMessage.indexOf('You must add a nonce to a script tag') >= 0).to.be.true;

    }
  });

  it('should not throw an error for inline styles as allowInlineStyles is set', async () => {
    const inputHTML = `
      <html>
        <head>
        </head>
        <body>
        <div style="color:black;">inlinestyle</div>
        </body>
      </html>
    `;

    const options = {
      include: '**/*.html',
      exclude: 'exclude.html',
      allowInlineStyles: true
    };
    const code = inputHTML;
    const id = 'example.html';

    try {
      const plugin = rollupCspHtmlLinter(options);
      await plugin.transform(code, id);
      plugin.buildEnd();
    } catch (error) {
      throw new Error('Unexpected error: ' + error.message);
    }
  });

  it('should not throw an error for inline js as allowInlineJs is set', async () => {
    const inputHTML = `
      <html>
        <head>
        
        </head>
        <body>
          <a href="javascript:alert('Hello, World!')">Link</a>
          <iframe src="javascript:alert('Hello, World!')"></iframe>

          <div onclick="doSomething()"></div>
          <div onchange="doSomething()">onchange</div>
          <div onkeydown="doSomething()">onkeydown</div>
          <div onkeyup="doSomething()">onkeyup</div>
          <div onkeypress="doSomething()">onkeypress</div>
          <div onpaste="doSomething()">onpaste</div>
          <div onblur="doSomething()">onblur</div>
          <div onfocus="doSomething()">onfocus</div>
          <div onmousedown="doSomething()">onmousedown</div>
          <div onmouseup="doSomething()">onmouseup</div>
          <div onmouseenter="doSomething()">onmouseenter</div>
          <div onmouseout="doSomething()">onmouseout</div>
          <div onmouseover="doSomething()">onmouseover</div>
          <div onmousewheel="doSomething()">onmousewheel</div>
          <div onmousemove="doSomething()">onmousemove</div>
          <div onmouseleave="doSomething()">onmouseleave</div>
          <div onload="doSomething()">onload</div>
          <div onunload="doSomething()">onunload</div>
          <div onbeforeunload="doSomething()">onbeforeunload</div>
          <div onsubmit="doSomething()">onsubmit</div>
          <div onselect="doSomething()">onselect</div>
          <div onscroll="doSomething()">onscroll</div>
          <div onresize="doSomething()">onresize</div>
          <div oninput="doSomething()">oninput</div>
          <div oninvalid="doSomething()">oninvalid</div>
          <div onerror="doSomething()">onerror</div>
          <div onbeforeprint="doSomething()">onbeforeprint</div>
          <div onafterprint="doSomething()">onafterprint</div>

        </body>
      </html>
    `;

    const options = {
      include: '**/*.html',
      exclude: 'exclude.html',
      allowInlineJs: true
    };
    const code = inputHTML;
    const id = 'example.html';

    try {
      const plugin = rollupCspHtmlLinter(options);
      await plugin.transform(code, id);
      plugin.buildEnd();
    } catch (error) {
      throw new Error('Unexpected error: ' + error.message);
    }
  });

  it('should not throw an error for style tag without nonce as allowStyleTagWithoutNonce is set', async () => {
    const inputHTML = `
      <html>
        <head>
        
        </head>
        <body>
          <style>
          .someClass{
            color:blue;
          }</style>

        </body>
      </html>
    `;

    const options = {
      include: '**/*.html',
      exclude: 'exclude.html',
      allowStyleTagWithoutNonce: true
    };
    const code = inputHTML;
    const id = 'example.html';

    try {
      const plugin = rollupCspHtmlLinter(options);
      await plugin.transform(code, id);
      plugin.buildEnd();
    } catch (error) {
      throw new Error('Unexpected error: ' + error.message);
    }
  });
  it('should not throw an error for script tag without nonce as allowScriptTagWithoutNonce is set', async () => {
    const inputHTML = `
      <html>
        <head>
        
        </head>
        <body>
          <script src="https://www.someurl.com"></script>

        </body>
      </html>
    `;

    const options = {
      include: '**/*.html',
      exclude: 'exclude.html',
      allowScriptTagWithoutNonce: true
    };
    const code = inputHTML;
    const id = 'example.html';

    try {
      const plugin = rollupCspHtmlLinter(options);
      await plugin.transform(code, id);
      plugin.buildEnd();
    } catch (error) {
      throw new Error('Unexpected error: ' + error.message);
    }
  });

  it('should not throw an error for valid HTML', async () => {
    const validHTML = `
      <html>
        <head>
          <style nonce="abcd1234">Valid Style</style>
          <script nonce="abcd1234" src="valid.js"></script>
        </head>
        <body>
          <a href="https://example.com">Link</a>
          <div></div>
        </body>
      </html>
    `;
    const options = {
      include: '**/*.html',
      exclude: 'exclude.html',
    };

    const code = validHTML;
    const id = 'example.html';

    try {
      const plugin = rollupCspHtmlLinter(options);
      await plugin.transform(code, id);
      plugin.buildEnd();
    } catch (error) {
      throw new Error('Unexpected error: ' + error.message);
    }
  });
});
