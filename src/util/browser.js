// class Canvas {
// 	constructor ( width = 300, height = 150 ) {	
// 		this.canvasEl = document.createElement( 'canvas' );
// 		this.canvasEl.width = width;
// 		this.canvasEl.height = height;
// 		this.ctx = this.canvasEl.getContext( '2d' );
// 	}

// 	getContext () {
// 		return this.ctx;
// 	}

// 	toDataURL ( type, encoderOptions, cb ) {
// 		if ( typeof cb === 'function' ) {
// 			cb( this.canvasEl.toDataURL( type, encoderOptions ) );
// 		} else {
// 			return this.canvasEl.toDataURL( type, encoderOptions );
// 		}
// 	}
	
// 	get width () {
// 		return this.canvasEl.width;
// 	}
	
// 	set width ( newWidth ) {
// 		this.canvasEl.width = newWidth;
// 	}

// 	get height () {
// 		return this.canvasEl.height;
// 	}

// 	set height ( newHeight ) {
// 		this.canvasEl.height = newHeight;
// 	}
// }

// Canvas.Image = Image;
// export default Canvas;

export function createCanvas ( width = 300, height = 150 ) {
	const canvasEl = document.createElement( 'canvas' );
	canvasEl.width = width;
	canvasEl.height = height;

	return canvasEl;
}

export const Image;

