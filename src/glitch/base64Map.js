const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const base64Map = base64Chars.split( '' );
const reversedBase64Map = { };

base64Map.forEach( function ( val, key ) { reversedBase64Map[val] = key; } );

export default {
	map: base64Map,
	reverse: reversedBase64Map
};

