// import Canvas from 'canvas';
// import Canvas from './browser.js';

// const Canvas = require( 'canvas' );
// export default Canvas;

// import { createCanvas as createCNVS, Image as IMG } from 'canvas';
// export { createCNVS as createCanvas, IMG as Image };

var { createCanvas, Image } = require( 'canvas' );

export var createCanvas = createCanvas;
export var Image = Image;

// export function createCanvas ( w, h ) {
// 	console.log( w, h );
// }

// export class Image {
// 	constructor () {
// 		console.log( 'IMG' );
// 	}
// }