import glitch from '../dist/glitch-canvas-browser.es6.js';
			
const imagePath = 'img/lincoln.jpg';
const imgContainerEl = document.getElementById( 'img-container' );
const canvasContainerEl = document.getElementById( 'canvas-container' );

const params = {
	amount:     35,
	iterations: 20,
	quality:    30,
	seed:       25
};

loadImage( imagePath, function ( img ) {
	glitch( params )
		.fromImage( img )
		.toDataURL()
		.then( function( dataURL ) {
			const imageEl = new Image();
			imageEl.src = dataURL;
			imgContainerEl.appendChild( imageEl );
		} );

	glitch( params )
		.fromImage( img )
		.toImageData()
		.then( function( imageData ) {
			const canvasEl = document.createElement( 'canvas' );
			canvasEl.width = imageData.width;
			canvasEl.height = imageData.height;
			canvasEl.style.width = imageData.width + 'px';
			const ctx = canvasEl.getContext( '2d' );
			canvasContainerEl.appendChild( canvasEl );
			ctx.putImageData( imageData, 0, 0 );
		} );
} );

function loadImage ( src, callback ) {
	const imageEl = new Image();

	imageEl.onload = function () {
		callback( imageEl );
	};

	imageEl.src = src;
}