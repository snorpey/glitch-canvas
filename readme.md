glitch-canvas
=============

What is it?
-----------
glitch-canvas is a JavaScript library for applying a glitch effect (see this
[example](http://i.imgur.com/jU1hiYl.png)) to a canvas element.

How to use it
-------------
glitch-canvas is designed to be used in web browsers (see
[Requirements](#requirements) for more information).

The library is used like this:

	glitch(image_data, parameters, callback);

* _ImageData_ **image_data** (required): is an ImageData object as required by [canvas.getImageData()](https://developer.mozilla.org/en/docs/Web/API/CanvasRenderingContext2D#getImageData()).
* _Object_ **parameters** (required): object containing the parameters for the glitch effect. You can check out my [jpg-glitch](http://snorpey.github.io/jpg-glitch/)
experiment to get a better understanding of the values. The following parameters are accepted:
```
	{
		seed:       25, // number between 0 and 99
		quality:    30, // number between 0 and 99
		amount:     35, // number between 0 and 99
		iterations: 20  // number
	}
```
* _function_ **callback** (required): callback function that gets passed a glitched
ImageData object as argument.

Simple Example
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

There are more detailed examples available in the ``examples/`` folder.

Loading
-------
The library supports loading as an [AMD module](https://en.wikipedia.org/wiki/Asynchronous_module_definition)
with [RequireJS](http://requirejs.org).

Requirements
------------
The following browser features are required for the library to work:

* canvas support (including canvas.toDataURL method)
* Array.prototype.forEach

The library does NOT check if those features are supported in the browser.

License
-------
[MIT](LICENSE)