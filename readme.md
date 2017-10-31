[![Build Status](https://travis-ci.org/snorpey/glitch-canvas.png?branch=master)](https://travis-ci.org/snorpey/glitch-canvas)
[![Greenkeeper badge](https://badges.greenkeeper.io/snorpey/glitch-canvas.svg)](https://greenkeeper.io/)

glitch-canvas
=============

downloads
---------

* [glitch-canvas-browser.min.js](https://raw.githubusercontent.com/snorpey/glitch-canvas/master/dist/glitch-canvas-browser.min.js) 6kb (3kb gzipped)
* [glitch-canvas-browser.js](https://raw.githubusercontent.com/snorpey/glitch-canvas/master/dist/glitch-canvas-browser.js) 15kb (4kb gzipped)
* [glitch-canvas-browser-with-polyfills.min.js](https://raw.githubusercontent.com/snorpey/glitch-canvas/master/dist/glitch-canvas-browser-with-polyfills.min.js) 14kb (5kb gzipped)
* [glitch-canvas-browser-with-polyfills.js](https://raw.githubusercontent.com/snorpey/glitch-canvas/master/dist/glitch-canvas-browser-with-polyfills.js) 46kb (12kb gzipped)
* [glitch-canvas-browser.es6.min.js](https://raw.githubusercontent.com/snorpey/glitch-canvas/master/dist/glitch-canvas-browser.es6.min.js) 7kb (3kb gzipped)
* [glitch-canvas-master.zip](https://github.com/snorpey/glitch-canvas/archive/master.zip) 516kb

```$ npm install glitch-canvas```

what is it?
-----------
glitch-canvas is a javascript library for applying a glitch effect to a canvas element. it can be used to transform images to look like this:

![glitched image](glitch-example.png)

for a live example, you can check out my [jpg-glitch](http://snorpey.github.io/jpg-glitch) editor online.

how to use it
-------------
this library can be used in web browsers as well as in node. it supports loading as an AMD module, as a CommonJS module or a global variable..

a simple example:

```javascript
	glitch( { seed: 25, quality: 30 } )
		.fromImage( image )
		.toDataURL()
		.then( function( dataURL ) {
			var glitchedImg = new Image();
			glitchedImg.src = dataURL;
		} );
```

as you can see, there are __three__ calls happening:

1. ``glitch()`` is called with the __glitch parameters__
2. then ``fromImage()`` is called with the __input__ image as parameter
3. and finally ``toDataURL()`` is called to __output__ a dataURL.

when using the library, always follow these three steps:

1. _glitch_
2. _input_
3. _output_

all input and output methods are asynchronous and use promises for flow control.

for an explanation of all available methods and parameters, check out the [reference](#reference) section below.

you can find more examples for both node and the browser in the [examples](examples) folder of this repository.

reference
===

* [``glitch()``](#glitch)
* input: [``fromImage()``](#fromimage), [``fromImageData()``](#fromimagedata), [``fromBuffer()``](#frombuffer), [``fromStream()``](#fromstream)
* output: [``toDataURL()``](#todataurl), [``toImageData()``](#toimagedata), [``toBuffer()``](#tobuffer), [``toJPGStream()``](#tojpgstream), [``toPNGStream()``](#topngstream)

glitch()
---
``glitch()`` can take the following parameters that control how the glitched image is going to look:

```javascript

// the parameters listed are the default params

var glitchParams = {
	seed:       25, // integer between 0 and 99
	quality:    30, // integer between 0 and 99
	amount:     35, // integer between 0 and 99
	iterations: 20  // integer
};

```

_please note_: depending on the size, quality and contents of the source image and the number of iterations, the visual effect of the `seed` and `amount` parameters can be marginal or not even noticeable.

it returns an object containing all __input methods__.

fromImage()
---
``fromImage()`` expects an ``Image`` object as its only parameter. it returns an object containing all _input methods_.

example:

```javascript
var image = new Image();

image.onload = function () {
	glitch()
		.fromImage( image )
		.toDataURL()
		.then( function( dataURL ) {
			var glitchedImg = new Image();
			glitchedImg.src = dataURL;
			document.body.appendChild( glitchedImg );
		} );
};

image.src = 'lincoln.jpg'
```

_please note_: this method is not available in node.
_important_: when using the library in a browser, make sure the image was loaded before glitching it.

fromImageData()
---
``fromImageData()`` expects an ``ImageData`` object as its only parameter. it returns an object containing all _input methods_.

example:

```javascript
var canvas = document.createElement( 'canvas' );
var ctx = canvas.getContext( '2d' );

ctx.fillStyle = 'red';
ctx.fillRect( 30, 30, 90, 45 );
ctx.fillStyle = 'green';
ctx.fillRect( 10, 20, 50, 60 );

var imageData = ctx.getImageData( 0, 0, canvas.width, canvas.height );

glitch()
	.fromImageData( imageData )
	.toDataURL()
	.then( function( dataURL ) {
		var glitchedImg = new Image();
		glitchedImg.src = dataURL;
		document.body.appendChild( glitchedImg );
	} );
```

fromBuffer()
---
``fromBuffer()`` expects a ``Buffer`` object as its only parameter. it returns an object containing all _input methods_.

it uses [image#src=buffer](https://github.com/Automattic/node-canvas#imagesrcbuffer) from [node-canvas](https://github.com/Automattic/node-canvas) internally.

example:

```javascript
var fs = require('fs');

fs.readFile( './lincoln.jpg', function ( err, buffer ) {
	if ( err ) { throw err; }
		
	glitch()
		.fromBuffer( buffer )
		.toBuffer()
		.then( function ( glitchedBuffer ) {
			fs.writeFile( __dirname + '/glitched-lincoln.png', glitchedBuffer, function ( err ) {
				if ( err ) { throw err; }
				console.log( 'file glitched.' );
			} );
		} );
} );
```

_please note_: this method is only available in node.

fromStream()
---
``fromStream()`` expects a ``ReadableStream`` object as its only parameter. it returns an object containing all _input methods_.

it uses [image#src=buffer](https://github.com/Automattic/node-canvas#imagesrcbuffer) from [node-canvas](https://github.com/Automattic/node-canvas) internally.

example:

```javascript
var fs = require('fs');

var inputStream = fs.createReadStream( './lincoln.jpg' );
var outputStream = fs.createWriteStream( './glitched-lincoln.png' );

glitch()
	.fromStream( inputStream )
	.toPNGStream()
	.then( function ( pngStream ) {
		pngStream.on( 'data', function ( chunk ) { outputStream.write( chunk ); } );
		pngStream.on( 'end', function () { console.log( 'png file saved.' ); } );
	} );
```

_please note_: this method is only available in node. currently, theres no input sanitation for this method, so you'll want to make sure that the input stream contains an image.

toDataURL()
---
``toDataURL()`` does not take any parameters. it returns a ``String`` containing the base64-encoded image url.

example:

```javascript
var image = new Image();

image.onload = function () {
	glitch()
		.fromImage( image )
		.toDataURL()
		.then( function( dataURL ) {
			var glitchedImg = new Image();
			glitchedImg.src = dataURL;
			document.body.appendChild( glitchedImg );
		} );
};

image.src = 'lincoln.jpg'
```

toImageData()
---
``toImageData()`` does not take any parameters. it returns an ``ImageData`` object.

example:

```javascript
var image = new Image();

image.onload = function () {
	glitch()
		.fromImage( image )
		.toImageData()
		.then( function ( imageData ) {
			var canvas = document.createElement( 'canvas' );
			var ctx = canvas.getContext( '2d' );
			ctx.putImageData( imageData, 0, 0 );

			document.body.appendChild( canvas );
		} );
};

image.src = 'lincoln.jpg'
```

toImage()
---
``toImage()`` does not take any parameters. it returns an ``Image`` object.

example:

```javascript
var image = new Image();

image.onload = function () {
	glitch()
		.fromImage( image )
		.toImage()
		.then( function ( glitchedImage ) {
			document.body.appendChild( glitchedImage );
		} );
};

image.src = 'lincoln.jpg'
```

_please note_: this method is only available in the browser.

toBuffer()
---
``toBuffer()`` doesn't take any parameters. it uses [canvas#tobuffer](https://github.com/Automattic/node-canvas#canvastobuffer) from [node-canvas](https://github.com/Automattic/node-canvas) internally.

it returns a ``Buffer`` object.

example:

```javascript
var fs = require('fs');

fs.readFile( './lincoln.jpg', function ( err, buffer ) {
	if ( err ) { throw err; }
		
	glitch()
		.fromBuffer( buffer )
		.toBuffer()
		.then( function ( imageBuffer ) {
			fs.writeFile( './glitched-lincoln.png', imageBuffer, function ( err ) {
				if ( err ) { throw err; }
				console.log( 'created a pdf file.' );
			} );
		} );
} );
```

_please note_: this method is only available in node.

toJPGStream()
---
``toJPGStream()`` can take the following parameters:

```javascript
var jpgStreamParams = {
	bufsize: 4096,          // output buffer size in bytes
	quality: 75,            // jpg quality (0-100) default: 75
	progressive: false      // true for progressive compression
};

```

it uses [canvas#jpegstream()](https://github.com/Automattic/node-canvas#canvasjpegstream-and-canvassyncjpegstream) from [node-canvas](https://github.com/Automattic/node-canvas) internally.

it returns a ``JPEGStream`` object.

example:

```javascript
var fs = require('fs');
fs.readFile( __dirname + '/lincoln.jpg', function ( err, buffer ) {
		if ( err ) {
			throw err;
		}

		var fileStream = fs.createWriteStream( __dirname + '/glitched-lincoln.jpg' );
		
		glitch()
			.fromBuffer( buffer )
			.toJPGStream()
			.then( function ( jpgStream ) {
				jpgStream.on( 'data', function ( chunk ) { fileStream.write( chunk ); } );
				jpgStream.on( 'end', function () { console.log( 'file glitched.' ); } );
			} );
	} );
```

_please note_: this method is only available in node.

toJPEGStream()
---
see [``toJPGStream()``](#tojpgstream).

toPNGStream()
---
``toPNGStream()`` doesn't take any parameters. it uses [canvas#pngstream()](https://github.com/Automattic/node-canvas#canvaspngstream) from [node-canvas](https://github.com/Automattic/node-canvas) internally.

it returns a ``PNGStream`` object.

example:

```javascript
var fs = require('fs');
fs.readFile( __dirname + '/lincoln.jpg', function ( err, buffer ) {
		if ( err ) { throw err;	}

		var fileStream = fs.createWriteStream( __dirname + '/glitched-lincoln.png' );
		
		glitch()
			.fromBuffer( buffer )
			.toPNGStream()
			.then( function ( pngStream ) {
				pngStream.on( 'data', function ( chunk ) { fileStream.write( chunk ); } );
				pngStream.on( 'end', function () { console.log( 'file glitched.' ); } );
			}, function( err ) {
				console.log( 'There was an error', err );
			} );
	} );
```

_please note_: this method is only available in node.

development
===

`npm run build` will build the node-ready and browser-ready versions, which are saved to the `dist-node` and `dist` directories.

`npm run test` will run the tests in both the browser and node.

you can find the source code for the library in the ``src`` folder. it is using es6-style syntax.

license
===

[mit](LICENSE)

third party code
---

most of the folder structure and the npm script setup were taken from [nonalnawson](https://github.com/nolanlawson)'s [hello javascript](https://github.com/nolanlawson/hello-javascript) repo (Apache-2.0 license).

dependencies:

* [es6-promise](https://github.com/stefanpenner/es6-promise) by [stefanpenner](https://github.com/stefanpenner), MIT license
* [canvas-browserify](https://github.com/dominictarr/canvas-browserify) by [dominictarr](https://github.com/dominictarr), MIT license


glitch-canvas in the wild
-------------------------
* [jpg-glitch](http://snorpey.github.io/jpg-glitch): glitch editor 
* [glitch-img](https://github.com/kunjinkao/glitch-img): glitch-canvas web component
* [fuzzy.cc](http://www.fuzzywobble.com/project.php?p=77&n=glitch-image-on-hover): hover effect
* [G͋l̷i᷉t͠c̭h](http://rawgit.com/DUQE/glitch/master/index.html): glitch html
* [Be Aug Aware](https://augaware.org/)
* [Viewport Glitcher](https://github.com/zky829/viewport-glitcher/)

implementations in other languages
----------------------------------
* python: [jpglitch](https://github.com/Kareeeeem/jpglitch)

if you want to add your site or project to one of these lists, you can create a pull request or send me an email.

missing somehing?
---

found a bug? missing a feature? instructions unclear? are you using this library in an interesting project? maybe have a look at the [issues](../../issues), open a pull request and let me know. thanks!

most importantly
---

thank you for taking a look at this repo. have a great day :)

