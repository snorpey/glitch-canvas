what's up with all those files?
===
you'll probably just need one of them. let me help you pick the right one for your use case:

[glitch-canvas-browser.js](https://raw.githubusercontent.com/snorpey/glitch-canvas/master/dist/glitch-canvas-browser.js)
---
you can simply drop this script in an html page. works on new browsers, doesn't come with polyfills. you'll probably want to get this one.

[`glitch-canvas-browser-with-polyfills.js`](https://raw.githubusercontent.com/snorpey/glitch-canvas/master/dist/glitch-canvas-browser-with-polyfills.js)
---

same as above, but comes with polyfills for `Object.assign` and `Promise`. in case you need to support older browsers.

[`glitch-canvas-node.js`](https://raw.githubusercontent.com/snorpey/glitch-canvas/master/dist/glitch-canvas-node.js)
---

the node version of the library. this is what you get when you `npm install glitch-canvas`.


also available: 
---

only use one of these if you're concerned with file size

* [`glitch-canvas-browser.es6.js`](https://raw.githubusercontent.com/snorpey/glitch-canvas/master/dist/glitch-canvas-browser.es6.js): you use this if you want to import the library as an es6 module, like so: `import glitch from glitch-canvas-browser.es6.js;` requires es6 support (even in web workers)

* [`glitch-canvas-browser.es6.umd.js`](https://raw.githubusercontent.com/snorpey/glitch-canvas/master/dist/glitch-canvas-browser.es6.umd.js): you can simply drop this script in an html page. requires es6 support (even in web workers)

for all browser versions there are also minified versions available.