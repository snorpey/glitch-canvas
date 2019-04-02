class Canvas {
	constructor ( width = 300, height = 150 ) {
		if ( typeof window === 'undefined' ) {
			this.canvasEl = { width, height };
			this.ctx = null;
		} else {
			this.canvasEl = document.createElement( 'canvas' );
			this.canvasEl.width = width;
			this.canvasEl.height = height;
			this.ctx = this.canvasEl.getContext( '2d' );
		} 
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

if ( typeof window !== 'undefined' ) {
	Canvas.Image = Image;
}

export default Canvas;
