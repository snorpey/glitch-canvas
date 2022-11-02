/*global describe, it, expect, glitch*/
describe('glitch-canvas browser tests', function () {
	// prepare two canvas elements
	var canvas_one = document.getElementById('canvas-one');
	var canvas_two = document.getElementById('canvas-two');
	var ctx_one = canvas_one.getContext('2d');
	var ctx_two = canvas_two.getContext('2d');
	var canvas_width = canvas_one.clientWidth;
	var canvas_height = canvas_one.clientHeight;

	// draw white background
	ctx_one.fillStyle = '#ffffff';
	ctx_one.fillRect(0, 0, canvas_width, canvas_height);

	//draw some stuff so we have something to glitch
	ctx_one.beginPath();
	ctx_one.moveTo(23, 190);
	ctx_one.lineTo(230, 80);
	ctx_one.lineTo(150, 30);
	ctx_one.closePath();
	ctx_one.fillStyle = '#77bbaa';
	ctx_one.fill();

	ctx_one.fillStyle = '#ff0000';
	ctx_one.beginPath();
	ctx_one.arc(100, 100, 50, 0, Math.PI * 2, true);
	ctx_one.closePath();
	ctx_one.fill();

	ctx_one.fillStyle = '#0066ff';
	ctx_one.fillRect(120, 80, 120, 30);

	function callback(image_data) {
		ctx_two.clearRect(0, 0, canvas_width, canvas_height);
		ctx_two.putImageData(image_data, 0, 0);
	}

	var image_data = ctx_one.getImageData(0, 0, canvas_width, canvas_height);
	var parameters = { amount: 10, seed: 45, iterations: 30, quality: 30 };

	function glitchWithoutImageData() {
		glitch(undefined, parameters, callback);
	}
	function glitchWithEmptyImageData() {
		glitch({ width: 0, height: 0, data: [] }, parameters, callback);
	}
	function glitchWithoutParameters() {
		glitch(image_data, undefined, callback);
	}
	function glitchWithoutCallback() {
		glitch(image_data, parameters);
	}
	function glitchWithEmptyParameters() {
		glitch(image_data, {}, callback);
	}
	function glitchCorrectly() {
		glitch(image_data, parameters, callback);
	}

	// http://stackoverflow.com/a/15208067/229189
	function checkAsync(done, fn) {
		try {
			fn();
			done();
		} catch (e) {
			done(e);
		}
	}

	it('adds a global glitch function named "glitch"', function () {
		expect(typeof glitch).to.equal('function');
	});

	it('throws an error if no parameters are given', function () {
		expect(glitch).to.throw(Error);
	});

	it('throws an error if the image_data argument is not undefined', function () {
		expect(glitchWithoutImageData).to.throw(Error);
	});

	it('throws an error if the image_data argument is empty', function () {
		expect(glitchWithEmptyImageData).to.throw(Error);
	});

	it('throws an error if the parameters argument is undefined', function () {
		expect(glitchWithoutParameters).to.throw(Error);
	});

	it("doesn't throw an error if the parameters argument is empty", function () {
		expect(glitchWithEmptyParameters).not.to.throw(Error);
	});

	it('throws an error if the callback argument is not undefined', function () {
		expect(glitchWithoutCallback).to.throw(Error);
	});

	it("doesn't throw an error with correct arguments", function () {
		expect(glitchCorrectly).not.to.throw(Error);
	});

	it('does pass a valid imageData object to callback function', function (done) {
		glitch(image_data, parameters, function (glitched_image_data) {
			checkAsync(done, function () {
				expect(typeof glitched_image_data).to.equal('object');
				expect(typeof glitched_image_data.width).to.equal('number');
				expect(glitched_image_data.width).to.equal(canvas_width);
				expect(typeof glitched_image_data.height).to.equal('number');
				expect(glitched_image_data.height).to.equal(canvas_height);
				expect(typeof glitched_image_data.data).to.equal('object');
				expect(typeof glitched_image_data.data.length).to.equal(
					'number'
				);
				expect(glitched_image_data.data.length).to.equal(
					image_data.data.length
				);
			});
		});
	});
});
