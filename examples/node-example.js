var fs = require('fs');
var glitch = require('../dist/glitch-canvas-node.js');
var imagePath = 'img/lincoln.jpg';

fromBufferToDataURL();
fromBufferToPng();
fromBufferToJPGStream();
fromBufferToPNGStream();
fromStreamToPNGStream();

function fromBufferToDataURL () {
	fs.readFile( __dirname + '/' + imagePath, function ( err, buffer ) {
		if ( err ) {
			throw err;
		}
		
		glitch()
			.fromBuffer( buffer )
			.toDataURL()
			.then ( function ( dataURL ) {
				console.log( 'fromBufferToDataURL complete. Length of dataURL:', dataURL.length );
			}, function ( err ) {
				throw err;
			} );
	} );
}

function fromBufferToPng () {
	fs.readFile( __dirname + '/' + imagePath, function ( err, buffer ) {
		if ( err ) {
			throw err;
		}
		
		glitch()
			.fromBuffer( buffer )
			.toBuffer()
			.then( function ( imageBuffer ) {
				fs.writeFile( __dirname + '/node-output/fromBufferToPng.png', imageBuffer, function ( err ) {
					if ( err ) {
						throw err;
					} else {
						console.log( 'fromBufferToPng complete. File saved to', __dirname + '/node-output/fromBufferToPng.png' );
					}
				} );
			} );
	} );
}

function fromBufferToJPGStream () {
	fs.readFile( __dirname + '/' + imagePath, function ( err, buffer ) {
		if ( err ) {
			throw err;
		}

		var fileStream = fs.createWriteStream( __dirname + '/node-output/fromBufferToJPGStream.jpg' );
		
		glitch()
			.fromBuffer( buffer )
			.toJPGStream()
			.then( function ( jpgStream ) {
				jpgStream.on( 'data', function ( chunk ) { fileStream.write( chunk ); } );
				jpgStream.on( 'end', function () { console.log( 'fromBufferToJPGStream complete. File saved to', __dirname + '/node-output/fromBufferToJPGStream.jpg' ); } );
			} );
	} );
}

function fromBufferToPNGStream () {
	fs.readFile( __dirname + '/' + imagePath, function ( err, buffer ) {
		if ( err ) {
			throw err;
		}

		var fileStream = fs.createWriteStream( __dirname + '/node-output/fromBufferToPNGStream.jpg' );
		
		glitch()
			.fromBuffer( buffer )
			.toPNGStream()
			.then( function ( pngStream ) {
				pngStream.on( 'data', function ( chunk ) { fileStream.write( chunk ); } );
				pngStream.on( 'end', function () { console.log( 'fromBufferToPNGStream complete. File saved to', __dirname + '/node-output/fromBufferToPNGStream.jpg' ); } );
			}, function( err ) {
				console.log( 'There was an error', err );
			} );
	} );
}

function fromStreamToPNGStream () {
	var readStream = fs.createReadStream( __dirname + '/' + imagePath );
	var fileStream = fs.createWriteStream( __dirname + '/node-output/fromStreamToPNGStream.jpg' );

	glitch()
		.fromStream( readStream )
		.toPNGStream()
		.then( function ( pngStream ) {
			pngStream.on( 'data', function ( chunk ) { fileStream.write( chunk ); } );
			pngStream.on( 'end', function () { console.log( 'fromStreamToPNGStream complete. File saved to', __dirname + '/node-output/fromBufferToPNGStream.jpg' ); } );
		}, function( err ) {
			console.log( 'There was an error', err );
		} );
}