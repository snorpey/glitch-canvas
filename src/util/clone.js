export default function (obj) {
	let result = false;

	if (typeof obj !== 'undefined') {
		try {
			result = JSON.parse(JSON.stringify(obj));
		} catch (e) {}
	}

	return result;
}
