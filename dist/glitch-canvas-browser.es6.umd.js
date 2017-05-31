(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.glitch = factory());
}(this, (function () { 'use strict';

var clamp = function ( value, min, max ) {
	return value < min ? min : value > max ? max : value;
};

var clone = function ( obj ) {
	let result = false;
	
	if ( typeof obj !== 'undefined' ) {

		try {
			result = JSON.parse( JSON.stringify( obj ) );
		} catch ( e ) { }
	}
	
	return result;
};

var defaultParams = {
    amount:     35,
    iterations: 20,
    quality:    30,
	seed:       25
};

var sanitizeInput = function ( params ) {
	
	params = clone( params );

	if ( typeof params !== 'object' ) {
		params = { };
	}

	let defaultKeys = Object
		.keys( defaultParams )
		.filter( function ( key ) { return key !== 'iterations'; } );

	defaultKeys.forEach( function ( key ) {
		if ( typeof params[key] !== 'number' || isNaN( params[key] ) ) {
			params[key] = defaultParams[key];
		} else {
			params[key] = clamp( params[key], 0, 100 );
		}
		
		params[key] = Math.round( params[key] );
	} );

	if ( typeof params.iterations !== 'number' || isNaN( params.iterations ) || params.iterations <= 0 ) {
		params.iterations = defaultParams.iterations;	
	}

	params.iterations = Math.round( params.iterations );

	return params;
};

class Canvas$1 {
	constructor ( width = 300, height = 150 ) {	
		this.canvasEl = document.createElement( 'canvas' );
		this.canvasEl.width = width;
		this.canvasEl.height = height;
		this.ctx = this.canvasEl.getContext( '2d' );
	}

	getContext () {
		return this.ctx;
	}

	toDataURL ( type, encoderOptions, cb ) {
		if ( typeof cb === 'function' ) {
			cb( this.canvasEl.toDataURL( type, encoderOptions ) );
		} else {
			return this.canvasEl.toDataURL( type, encoderOptions );
		}
	}
	
	get width () {
		return this.canvasEl.width;
	}
	
	set width ( newWidth ) {
		this.canvasEl.width = newWidth;
	}

	get height () {
		return this.canvasEl.height;
	}

	set height ( newHeight ) {
		this.canvasEl.height = newHeight;
	}
}

Canvas$1.Image = Image;

var imageToImageData = function ( image ) {
	if ( image instanceof HTMLImageElement ) {
		// http://stackoverflow.com/a/3016076/229189
		if ( ! image.naturalWidth || ! image.naturalHeight || image.complete === false ) {
			throw new Error( "This this image hasn't finished loading: " + image.src );
		}

		const canvas = new Canvas$1( image.naturalWidth, image.naturalHeight );
		const ctx = canvas.getContext( '2d' );
		
		ctx.drawImage( image, 0, 0, canvas.width, canvas.height );

		const imageData = ctx.getImageData( 0, 0, canvas.width, canvas.height );

		if ( imageData.data && imageData.data.length ) {
			if ( typeof imageData.width === 'undefined' ) {
				imageData.width = image.naturalWidth;
			}

			if ( typeof imageData.height === 'undefined' ) {
				imageData.height = image.naturalHeight;
			}
		}
		
		return imageData;
	} else {
		throw new Error( 'This object does not seem to be an image.' );
		return;
	}
};

const Image$2 = Canvas$1.Image;

var loadBase64Image = function ( base64URL ) {
	return new Promise( function ( resolve, reject ) {
		let image = new Image$2();
		
		image.onload = function () {
			resolve( image );
		};

		image.onerror = function ( err ) {
			reject( err );
		};
		
		image.src = base64URL;
	} );
};

var base64URLToImage = function ( base64URL, opts, resolve, reject ) {
	loadBase64Image( base64URL )
		.then( resolve, reject );
};

var getImageSize = function ( image ) {
	return {
		width: image.width || image.naturalWidth,
		height: image.height || image.naturalHeight
	};
};

var canvasFromImage = function ( image ) {
	let size = getImageSize( image );
	let canvas = new Canvas$1( size.width, size.height );
	let ctx = canvas.getContext( '2d' );
	
	ctx.drawImage( image, 0, 0, size.width, size.height );
		
	return {
		canvas: canvas,
		ctx: ctx
	};
};

var base64URLToImageData = function ( base64URL, options, resolve, reject ) {
	loadBase64Image( base64URL )
		.then( function ( image ) {
			let size = getImageSize( image );
			let imageData = canvasFromImage( image ).ctx.getImageData( 0, 0, size.width, size.height );
			
			if ( ! imageData.width ) {
				imageData.width = size.width;
			}

			if ( ! imageData.height ) {
				imageData.height = size.height;
			}

			resolve( imageData );
		}, reject );
};

var isImageData = function ( imageData ) {
	return (
		imageData && 
		typeof imageData.width === 'number' &&
		typeof imageData.height === 'number' &&
		imageData.data &&
		typeof imageData.data.length === 'number' &&
		typeof imageData.data === 'object'
	);
};

var imageDataToBase64 = function ( imageData, quality ) {
	return new Promise ( function ( resolve, reject ) {
		if ( isImageData( imageData ) ) {
			const canvas = new Canvas$1( imageData.width, imageData.height );
			const ctx = canvas.getContext( '2d' );
			ctx.putImageData( imageData, 0, 0 );

			const base64URL = canvas.toDataURL( 'image/jpeg', quality / 100 );

			resolve( base64URL );
		} else {
			reject( new Error( 'object is not valid imageData' ) );
		}
	} );
};

const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const base64Map = base64Chars.split( '' );
const reversedBase64Map$1 = { };

base64Map.forEach( function ( val, key ) { reversedBase64Map$1[val] = key; } );

// https://github.com/mutaphysis/smackmyglitchupjs/blob/master/glitch.html
// base64 is 2^6, byte is 2^8, every 4 base64 values create three bytes

// http://stackoverflow.com/a/10424014/229189

var objectAssign = Object.assign;


// constructing an object that allows for a chained interface.
// for example stuff like:
// 
// glitch( params )
//     .toImage( img )
//     .toImageData()
// 
// etc...

function glitch ( params ) {
	params = sanitizeInput( params );

	let inputFn;
	let outputFn;

	let worker = new Worker( URL.createObjectURL(new Blob(["var isImageData = function ( imageData ) {\n\treturn (\n\t\timageData && \n\t\ttypeof imageData.width === 'number' &&\n\t\ttypeof imageData.height === 'number' &&\n\t\timageData.data &&\n\t\ttypeof imageData.data.length === 'number' &&\n\t\ttypeof imageData.data === 'object'\n\t);\n};\n\nconst base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';\nconst base64Map = base64Chars.split( '' );\nconst reversedBase64Map$1 = { };\n\nbase64Map.forEach( function ( val, key ) { reversedBase64Map$1[val] = key; } );\n\nvar maps = {\n\tbase64Map,\n\treversedBase64Map: reversedBase64Map$1\n};\n\nconst reversedBase64Map = maps.reversedBase64Map;\n\n// https://github.com/mutaphysis/smackmyglitchupjs/blob/master/glitch.html\n// base64 is 2^6, byte is 2^8, every 4 base64 values create three bytes\nvar base64ToByteArray = function ( base64URL ) {\t\n\tvar result = [ ];\n\tvar digitNum;\n\tvar currrentChar;\n\tvar prev;\n\n\tfor ( var i = 23, len = base64URL.length; i < len; i++ ) {\n\t\tcurrrentChar = reversedBase64Map[ base64URL.charAt( i ) ];\n\t\tdigitNum = ( i - 23 ) % 4;\n\n\t\tswitch ( digitNum ) {\n\t\t\t// case 0: first digit - do nothing, not enough info to work with\n\t\t\tcase 1: // second digit\n\t\t\t\tresult.push( prev << 2 | currrentChar >> 4 );\n\t\t\t\tbreak;\n\t\t\t\n\t\t\tcase 2: // third digit\n\t\t\t\tresult.push( ( prev & 0x0f ) << 4 | currrentChar >> 2 );\n\t\t\t\tbreak;\n\t\t\t\n\t\t\tcase 3: // fourth digit\n\t\t\t\tresult.push( ( prev & 3 ) << 6 | currrentChar );\n\t\t\t\tbreak;\n\t\t}\n\n\t\tprev = currrentChar;\n\t}\n\n\treturn result;\n};\n\n// http://stackoverflow.com/a/10424014/229189\n\nvar jpgHeaderLength = function ( byteArr ) {\n\tvar result = 417;\n\n\tfor ( var i = 0, len = byteArr.length; i < len; i++ ) {\n\t\tif ( byteArr[i] === 0xFF && byteArr[i + 1] === 0xDA ) {\n\t\t\tresult = i + 2;\n\t\t\tbreak;\n\t\t}\n\t}\n\n\treturn result;\n};\n\nvar glitchByteArray = function ( byteArray, seed, amount, iterationCount ) {\n\tlet headerLength = jpgHeaderLength( byteArray );\n\tlet maxIndex = byteArray.length - headerLength - 4;\n\n\tlet amountPercent = amount / 100;\n\tlet seedPercent   = seed / 100;\n\n\tfor ( var iterationIndex = 0; iterationIndex < iterationCount; iterationIndex++ ) {\n\t\tlet minPixelIndex = ( maxIndex / iterationCount * iterationIndex ) | 0;\n\t\tlet maxPixelIndex = ( maxIndex / iterationCount * ( iterationIndex + 1 ) ) | 0;\n\t\t\n\t\tlet delta = maxPixelIndex - minPixelIndex;\n\t\tlet pixelIndex = ( minPixelIndex + delta * seedPercent ) | 0;\n\n\t\tif ( pixelIndex > maxIndex ) {\n\t\t\tpixelIndex = maxIndex;\n\t\t}\n\n\t\tlet indexInByteArray = ~~( headerLength + pixelIndex );\n\n\t\tbyteArray[indexInByteArray] = ~~( amountPercent * 256 );\n\t}\n\n\treturn byteArray;\n};\n\nconst base64Map$1 = maps.base64Map;\n\nvar byteArrayToBase64 = function ( byteArray ) {\n\tlet result = [ 'data:image/jpeg;base64,' ];\n\tlet byteNum;\n\tlet currentByte;\n\tlet previousByte;\n\n\tfor ( var i = 0, len = byteArray.length; i < len; i++ ) {\n\t\tcurrentByte = byteArray[i];\n\t\tbyteNum = i % 3;\n\n\t\tswitch ( byteNum ) {\n\t\t\tcase 0: // first byte\n\t\t\t\tresult.push( base64Map$1[ currentByte >> 2 ] );\n\t\t\t\tbreak;\n\t\t\tcase 1: // second byte\n\t\t\t\tresult.push( base64Map$1[( previousByte & 3 ) << 4 | ( currentByte >> 4 )] );\n\t\t\t\tbreak;\n\t\t\tcase 2: // third byte\n\t\t\t\tresult.push( base64Map$1[( previousByte & 0x0f ) << 2 | ( currentByte >> 6 )] );\n\t\t\t\tresult.push( base64Map$1[currentByte & 0x3f] );\n\t\t\t\tbreak;\n\t\t}\n\n\t\tpreviousByte = currentByte;\n\t}\n\n\tif ( byteNum === 0 ) {\n\t\tresult.push( base64Map$1[( previousByte & 3 ) << 4] );\n\t\tresult.push( '==' );\n\t} else {\n\t\tif ( byteNum === 1 ) {\n\t\t\tresult.push( base64Map$1[( previousByte & 0x0f ) << 2] );\n\t\t\tresult.push( '=' );\n\t\t}\n\t}\n\n\treturn result.join( '' );\n};\n\nvar glitchImageData = function ( imageData, base64URL, params ) {\n\tif ( isImageData( imageData ) ) {\n\t\tlet byteArray = base64ToByteArray( base64URL );\n\t\tlet glitchedByteArray = glitchByteArray( byteArray, params.seed, params.amount, params.iterations );\n\t\tlet glitchedBase64URL = byteArrayToBase64( glitchedByteArray );\n\t\treturn glitchedBase64URL;\n\t} else {\n\t\tthrow new Error( 'glitchImageData: imageData seems to be corrupt.' );\n\t\treturn;\n\t}\n};\n\nonmessage = function ( msg ) {\n\tconst imageData = msg.data.imageData;\n\tconst params = msg.data.params;\n\tconst base64URL = msg.data.base64URL;\n\n\tif ( imageData && base64URL && params ) {\n\t\ttry {\n\t\t\t// phantomjs seems to have some memory loss so we need to make sure\n\t\t\tif ( typeof imageData.width === 'undefined' && typeof msg.data.imageDataWidth === 'number' ) {\n\t\t\t\timageData.width = msg.data.imageDataWidth;\n\t\t\t}\n\n\t\t\tif ( typeof imageData.height === 'undefined' && typeof msg.data.imageDataHeight === 'number' ) {\n\t\t\t\timageData.height = msg.data.imageDataHeight;\n\t\t\t}\n\n\t\t\tconst glitchedBase64URL = glitchImageData( imageData, base64URL, params );\n\t\t\tsuccess( glitchedBase64URL );\n\n\t\t} catch ( err ) {\n\t\t\tfail( err );\n\t\t}\n\n\t} else {\n\t\tif ( msg.data.imageData ) {\n\t\t\tfail( 'Parameters are missing.' );\n\t\t} else {\n\t\t\tfail( 'ImageData is missing.' );\n\t\t}\n\t}\n\t\n\tself.close();\n};\n\nfunction fail ( err ) {\n\tself.postMessage( { err: err.message || err } );\n}\n\nfunction success ( base64URL ) {\n\tself.postMessage( { base64URL: base64URL } );\n}\n"],{type:'text/javascript'})) );//work( glitchWorker );
	
	let api = {
		getParams,
		getInput,
		getOutput
	};

	let inputMethods = {
		fromImageData,
		fromImage
	};

	let outputMethods = {
		toImage,
		toDataURL,
		toImageData
	};

	function getParams () {
		return params;
	}

	function getInput () {
		var result = objectAssign( { }, api );

		if ( ! inputFn ) {
			objectAssign( result, inputMethods );
		}

		return result;
	}

	function getOutput () {
		var result = objectAssign( { }, api );

		if ( ! outputFn ) {
			objectAssign( result, outputMethods );
		}

		return result;
	}

	function noTransform ( x ) { return x; }

	function fromImage ( inputOptions ) { return setInput( imageToImageData, inputOptions ); }
	function fromImageData ( inputOptions ) { return setInput( noTransform, inputOptions ); }

	function toDataURL ( outputOptions ) { return setOutput( noTransform ); }
	function toImage ( outputOptions ) { return setOutput( base64URLToImage, outputOptions, true ); }
	function toImageData ( outputOptions ) { return setOutput( base64URLToImageData, outputOptions, true ); }

	function setInput ( fn, inputOptions, canResolve ) {		
		inputFn = function () {
			return new Promise( function ( resolve, reject ) {
				if ( canResolve ) {
					fn( inputOptions, resolve, reject );
				} else {
					if ( fn === noTransform ) {
						resolve( inputOptions );
					} else {
						try {
							resolve( fn( inputOptions, resolve, reject ) );
						} catch ( err ) {
							reject( err );
						}
					}
				}
			} );
		};

		if ( isReady() ) {
			return getResult();
		} else {
			return getOutput();
		}
	}

	function setOutput ( fn, outputOptions, canResolve ) {
		outputFn = function ( base64URL ) {
			return new Promise( function ( resolve, reject ) {
				if ( canResolve ) {
					fn( base64URL, outputOptions, resolve, reject );
				} else {
					if ( fn === noTransform ) {
						resolve( base64URL );
					} else {
						fn( base64URL, outputOptions )
							.then( resolve, reject );
					}
				}
			} );
		};

		if ( isReady() ) {
			return getResult();
		} else {
			return getInput();
		}
	}

	function isReady () {
		return inputFn && outputFn;
	}

	function getResult () {
		return new Promise( function ( resolve, reject ) {
			inputFn()
				.then( function ( imageData ) {
					return glitch( imageData, params );
				}, reject )
				.then( function ( base64URL ) {
					outputFn( base64URL )
						.then( resolve, reject );
				}, reject );
		} );
	}

	function glitch ( imageData, params ) {
		return new Promise( function ( resolve, reject ) {
			imageDataToBase64( imageData, params.quality )
				.then( function ( base64URL ) {
					return glitchInWorker( imageData, base64URL, params );
				}, reject )
				.then( resolve, reject );
		} );
	}

	function glitchInWorker ( imageData, base64URL, params ) {
		return new Promise( function ( resolve, reject ) {
			worker.addEventListener( 'message', function ( event ) {
				if ( event.data && event.data.base64URL ) {
					resolve( event.data.base64URL );
				} else {
					if ( event.data && event.data.err ) {
						reject( event.data.err );
					} else {
						reject( event );
					}
				}
			} );

			worker.postMessage( {
				params: params,
				base64URL: base64URL,
				imageData: imageData,

				// phantomjs tends to forget about those two
				// so we send them separately
				imageDataWidth: imageData.width,
				imageDataHeight: imageData.height
			} );
		} );
	}

	return getInput();
}

return glitch;

})));
