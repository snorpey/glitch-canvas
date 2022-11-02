const base64Chars =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const base64Map = base64Chars.split('');
const reversedBase64Map = {};

base64Map.forEach((val, key) => {
	reversedBase64Map[val] = key;
});

export default {
	base64Map,
	reversedBase64Map,
};
