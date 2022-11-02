import loadBase64Image from '../../util/loadBase64Image';

export default function (base64URL, opts, resolve, reject) {
	loadBase64Image(base64URL).then(resolve, reject);
}
