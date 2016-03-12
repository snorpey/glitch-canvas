import jpgHeaderLength from './jpgHeaderLength';

export default function ( byteArray, seed, amount, iterationCount ) {
	let headerLength = jpgHeaderLength( byteArray );
	let maxIndex = byteArray.length - headerLength - 4;

	let amountPercent = amount / 100;
	let seedPercent   = seed / 100;

	for ( var iterationIndex = 0; iterationIndex < iterationCount; iterationIndex++ ) {
		let minPixelIndex = ( maxIndex / iterationCount * iterationIndex ) | 0;
		let maxPixelIndex = ( maxIndex / iterationCount * ( iterationIndex + 1 ) ) | 0;
		
		let delta = maxPixelIndex - minPixelIndex;
		let pixelIndex = ( minPixelIndex + delta * seedPercent ) | 0;

		if ( pixelIndex > maxIndex ) {
			pixelIndex = maxIndex;
		}

		let indexInByteArray = ~~( headerLength + pixelIndex );

		byteArray[indexInByteArray] = ~~( amountPercent * 256 );
	}

	return byteArray;
}