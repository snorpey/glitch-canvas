var defaultParams = {
	amount: 35,
	iterations: 20,
	quality: 30,
	seed: 25,
};

var imagePath = 'http://localhost:9876/base/img/lincoln.jpg';

describe('browser tests for glitch-canvas', function () {
	it('should add a global function named "glitch"', function () {
		expect(glitch).to.be.a('function');
	});

	it('should return an object', function () {
		expect(glitch()).to.be.an('object');
	});

	it('should return all input methods available in the browser', function () {
		var g = glitch();
		expect(g.fromImage).to.be.a('function');
		expect(g.fromImageData).to.be.a('function');
	});

	it('should have a getParams method', function () {
		expect(glitch().getParams).to.be.a('function');
	});

	// getParams()

	describe('#getParams()', function () {
		it('should return an object with all parameters', function () {
			var params = glitch().getParams();
			expect(params.amount).to.be.a('number');
			expect(params.iterations).to.be.a('number');
			expect(params.quality).to.be.a('number');
			expect(params.seed).to.be.a('number');
		});

		it('should set the default no parameters are submitted', function () {
			var params = glitch().getParams();

			for (var key in defaultParams) {
				expect(params[key]).to.be.equal(defaultParams[key]);
			}
		});

		it('should add missing parameters', function () {
			var params = glitch({ amount: 10, blur: 90 }).getParams();

			for (var key in defaultParams) {
				expect(params[key]).not.to.be.equal(undefined);
			}
		});

		it('should clamp the parameters', function () {
			var params = glitch({
				amount: 300,
				iterations: -23,
				quality: 1023.2,
				seed: 0,
			}).getParams();

			for (var key in defaultParams) {
				expect(params[key]).to.be.within(0, 100);
			}
		});
	});

	it('should not have a fromBuffer method', function () {
		expect(glitch().fromBuffer).to.be.equal(undefined);
	});

	describe('Asynchronous Methods', function () {
		it('should have a fromImage method', function () {
			expect(glitch().fromImage).to.be.a('function');
		});

		describe('#fromImage()', function () {
			it('should accept a loaded image as parameter', function (done) {
				// loadImage( done, function ( img ) {
				loadImage().then(img => {
					var failed = false;

					glitch()
						.fromImage(img)
						.toDataURL()
						.then(
							function (res) {
								return false;
							},
							function (err) {
								return true;
							}
						)
						.then(failed => {
							expect(failed).to.be.false;
							done();
						}, done);
				}, done);
			});

			it('should throw an error if an image was not loaded', function (done) {
				var img = new Image();
				var failed = false;

				glitch()
					.fromImage(img)
					.toDataURL()
					.then(
						function (res) {
							return false;
							check();
						},
						function (err) {
							return true;
							check();
						}
					)
					.then(failed => {
						expect(failed).to.be.true;
						done();
					}, done);
			});
		});

		// fromImageData

		it('should have a fromImageData method', function () {
			expect(glitch().fromImageData).to.be.a('function');
		});

		describe('#fromImageData()', function () {
			it('should be able to handle an imageData object', function (done) {
				loadImage().then(img => {
					var imageData = imageToImageData(img);

					var failed = false;

					glitch()
						.fromImageData(imageData)
						.toDataURL()
						.then(
							function (res) {
								failed = false;
								check();
							},
							function (err) {
								failed = true;
								check(err);
							}
						);

					function check(err) {
						expect(failed).to.be.false;
						done(err);
					}
				}, done);
			});

			it('should throw an error when provided with corrupt imageData object', function (done) {
				var failed = false;
				glitch()
					.fromImageData({ width: 0, data: 'LOL', height: 10 })
					.toDataURL()
					.then(
						function (res) {
							failed = false;
							check();
						},
						function (err) {
							failed = true;
							check();
						}
					);

				function check() {
					expect(failed).to.be.true;
					done();
				}
			});

			it('should throw an error when provided with no imageData object', function (done) {
				var failed = false;
				glitch()
					.fromImageData()
					.toDataURL()
					.then(
						function (res) {
							failed = false;
							check();
						},
						function (err) {
							failed = true;
							check();
						}
					);

				function check() {
					expect(failed).to.be.true;
					done();
				}
			});
		});

		// toDataURL

		it('should have a toDataURL method', function () {
			expect(glitch().fromImage().toDataURL).to.be.a('function');
		});

		describe('#toDataURL()', function () {
			it('should return a dataURL', function (done) {
				loadImage()
					.then(img => glitch().fromImage(img).toDataURL())
					.then(function (url) {
						expect(url).to.be.a('string');
						expect(url.length).to.be.above(21);
						expect(
							url.indexOf('data:image/jpeg;base64')
						).to.be.equal(0);
						done();
					}, done);
			});
		});

		// toImageData

		it('should have a toImageData method', function () {
			expect(glitch().fromImage().toImageData).to.be.a('function');
		});

		describe('#toImageData()', function () {
			it('should return an imageData object', function (done) {
				loadImage().then(img => {
					glitch()
						.fromImage(img)
						.toImageData()
						.then(function (imageData) {
							expect(typeof imageData).to.be.equal('object');
							expect(typeof imageData.width).to.be.equal(
								'number'
							);
							expect(typeof imageData.height).to.be.equal(
								'number'
							);
							expect(typeof imageData.data).not.to.be.equal(
								undefined
							);
							expect(imageData.data.length).to.be.above(0);

							done();
						}, done);
				}, done);
			});
		});

		// toImage

		it('should have a toImage method', function () {
			expect(glitch().fromImage().toImage).to.be.a('function');
		});

		describe('#toImage()', function () {
			it('should return an image element', function (done) {
				this.timeout(5000);

				loadImage()
					.then(img => glitch().fromImage(img).toImage())
					.then(function (img) {
						expect(img instanceof HTMLImageElement).to.be.equal(
							true
						);
						expect(typeof img.naturalWidth).to.be.equal('number');
						expect(typeof img.naturalHeight).to.be.equal('number');

						done();
					}, done);
			});
		});
	});
});

function loadImage() {
	return new Promise((done, fail) => {
		var img = new Image();

		img.onload = function () {
			done(img);
		};

		img.onerror = err => {
			fail(err);
		};

		img.src = imagePath;
	});
}

function imageToImageData(img) {
	var canvas = document.createElement('canvas');
	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;

	var ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0);

	return ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
}
