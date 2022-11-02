import maps from './base64Map.js';
const base64Map = maps.base64Map;

export default function (byteArray) {
	const result = ['data:image/jpeg;base64,'];
	let byteNum;
	let previousByte;

	for (let i = 0, len = byteArray.length; i < len; i++) {
		const currentByte = byteArray[i];
		byteNum = i % 3;

		switch (byteNum) {
			case 0: // first byte
				result.push(base64Map[currentByte >> 2]);
				break;
			case 1: // second byte
				result.push(
					base64Map[((previousByte & 3) << 4) | (currentByte >> 4)]
				);
				break;
			case 2: // third byte
				result.push(
					base64Map[((previousByte & 0x0f) << 2) | (currentByte >> 6)]
				);
				result.push(base64Map[currentByte & 0x3f]);
				break;
		}

		previousByte = currentByte;
	}

	if (byteNum === 0) {
		result.push(base64Map[(previousByte & 3) << 4]);
		result.push('==');
	} else {
		if (byteNum === 1) {
			result.push(base64Map[(previousByte & 0x0f) << 2]);
			result.push('=');
		}
	}

	return result.join('');
}
