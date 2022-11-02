import jpgHeaderLength from './jpgHeaderLength';

export default function (byteArray, seed, amount, iterationCount) {
	const headerLength = jpgHeaderLength(byteArray);
	const maxIndex = byteArray.length - headerLength - 4;

	const amountPercent = amount / 100;
	const seedPercent = seed / 100;

	for (
		var iterationIndex = 0;
		iterationIndex < iterationCount;
		iterationIndex++
	) {
		const minPixelIndex =
			((maxIndex / iterationCount) * iterationIndex) | 0;
		const maxPixelIndex =
			((maxIndex / iterationCount) * (iterationIndex + 1)) | 0;

		const delta = maxPixelIndex - minPixelIndex;
		let pixelIndex = (minPixelIndex + delta * seedPercent) | 0;

		if (pixelIndex > maxIndex) {
			pixelIndex = maxIndex;
		}

		const indexInByteArray = ~~(headerLength + pixelIndex);

		byteArray[indexInByteArray] = ~~(amountPercent * 256);
	}

	return byteArray;
}
