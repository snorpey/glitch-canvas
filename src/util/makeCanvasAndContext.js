import Canvas from 'canvas-browserify';

export default function ( imageData ) {
	let canvas = new Canvas( imageData.width, imageData.height );
	let ctx = canvas.getContext( '2d' );

	ctx.putImageData( imageData, 0, 0 );
	
	return {
		canvas: canvas,
		ctx: ctx
	};
}