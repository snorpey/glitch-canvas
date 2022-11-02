// http://stackoverflow.com/a/10424014/229189

export default function (byteArr) {
	let result = 417;

	// https://en.wikipedia.org/wiki/JPEG#Syntax_and_structure
	// looks for the first occurence of 0xFF, 0xDA in the byteArray
	// which is the start of scan
	for (let i = 0, len = byteArr.length; i < len; i++) {
		if (byteArr[i] === 0xff && byteArr[i + 1] === 0xda) {
			result = i + 2;
			break;
		}
	}

	return result;
}
