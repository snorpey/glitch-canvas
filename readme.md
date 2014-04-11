[![Build Status](https://travis-ci.org/snorpey/glitch-canvas.png?branch=master)](https://travis-ci.org/snorpey/glitch-canvas)

glitch-canvas
=============

downloads
---------

* [glitch-canvas.min.js](https://raw.githubusercontent.com/snorpey/glitch-canvas/master/dist/glitch-canvas.min.js) 2kb
* [glitch-canvas.js](https://raw.githubusercontent.com/snorpey/glitch-canvas/master/dist/glitch-canvas.js) 7kb
* [glitch-canvas-master.zip](https://github.com/snorpey/glitch-canvas/archive/master.zip) 326kb

what is it?
-----------
glitch-canvas is a javascript library for applying a glitch effect to a canvas element. it can be used to transform images like this:

![glitched image](glitch-example.png)

for a live example, you can check out my [jpg-glitch](http://snorpey.github.io/jpg-glitch) editor online.

how to use it
-------------
glitch-canvas is designed to be used in web browsers (see
[requirements](#requirements) for more information).

the library is used like this:

	glitch(image_data, parameters, callback);

_imagedata_ **image_data** (required): is an ImageData object as returned by [canvas.getImageData()](https://developer.mozilla.org/en/docs/Web/API/CanvasRenderingContext2D#getImageData%28%29 ).

_object_ **parameters** (required): object containing the parameters for the glitch effect. you can check out my [jpg-glitch](http://snorpey.github.io/jpg-glitch/)
experiment to get a better understanding of the values. The following parameters are accepted:

```javascript
{
	seed:       25, // integer between 0 and 99
	quality:    30, // integer between 0 and 99
	amount:     35, // integer between 0 and 99
	iterations: 20  // integer
}
```

_function_ **callback** (required): callback function that gets passed a glitched
imagedata object as argument.

simple example
--------------
```javascript
// assuming there's a loaded image and a canvas element in the DOM.
var my_image = document.getElementById('my-image');
var my_canvas = document.getElementById('my-canvas');
var ctx = my_canvas.getContext('2d');

// draw the image on the canvas
ctx.drawImage(my_image, my_image);

var my_image_data = ctx.getImageData( 0, 0, my_canvas.clientWidth, my_canvas.clientHeight );
var parameters = { amount: 10, seed: 45, iterations: 30, quality: 30 };

function drawGlitchedImageData(image_data) {
	ctx.putImageData(image_data, 0, 0);
}

glitch(my_image_data, parameters, drawGlitchedImageData);
```

there are more detailed examples available in the ```./example/``` folder.

loading
-------
the library supports loading as an [amd module](https://en.wikipedia.org/wiki/Asynchronous_module_definition)
with [requirejs](http://requirejs.org).

requirements
------------
the following browser features are required for the library to work:

* canvas support (including canvas.toDataURL method)
* Array.prototype.forEach

the library does __not__ check if those features are actually supported in the browser.

build script
------------
the build script takes care of minifying the scripts files. it uses [gruntjs](http://gruntjs.com/).

please make sure that both [nodejs](http://nodejs.org/) and grunt-cli are [set up properly](http://gruntjs.com/getting-started) on your machine. run ```npm install``` from within the ```./build/``` folder to install the dependencies of the build script.

to build, run ```grunt``` from within the ```./build/``` folder. the optimized files will get copied to the ```./dist/``` folder.

tests
-----
before you run the tests, make sure you have [nodejs](http://nodejs.org) and [npm](http://npmjs.org) installed on your machine. open the ```./test/``` folder in your terminal and install the dependencies with ```npm install```. in addition to that, you may have to install mocha-phantomjs globally: ```npm install -g mocha-phantomjs```.

to run the tests, run ```mocha-phantomjs tester.html``` from the ```./test/``` folder.

license
-------
[mit](LICENSE)