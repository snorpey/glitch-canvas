export default function (image) {
	return {
		width: image.width || image.naturalWidth,
		height: image.height || image.naturalHeight,
	};
}
