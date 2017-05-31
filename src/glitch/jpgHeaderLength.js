// http://stackoverflow.com/a/10424014/229189

export default function ( byteArr ) {
	let result = 417;

	for ( var i = 0, len = byteArr.length; i < len; i++ ) {
		if ( byteArr[i] === 0xFF && byteArr[i + 1] === 0xDA ) {
			result = i + 2;
			break;
		}
	}

	return result;
}