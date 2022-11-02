/*global describe, it, done*/
var fs = require('fs');
var assert = require('assert');
var stream = require('stream');
var { createCanvas, Image, PNGStream, JPEGStream } = require('canvas');
var expect = require('expect.js');

// var Image = Canvas.Image;

var glitch = require('../dist/glitch-canvas-node.js');

var imagePath = '../examples/img/lincoln.jpg';

var defaultParams = {
	amount: 35,
	iterations: 20,
	quality: 30,
	seed: 25,
};

describe('node tests for glitch-canvas', function () {
	it('should add a global function named "glitch"', function () {
		expect(glitch).to.be.a('function');
	});

	it('should return an object', function () {
		expect(glitch()).to.be.an('object');
	});

	it('should return all input methods available in the browser', function () {
		var g = glitch();
		expect(g.fromBuffer).to.be.a('function');
		expect(g.fromImageData).to.be.a('function');
		expect(g.fromStream).to.be.a('function');
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
				expect(params[key]).to.be(defaultParams[key]);
			}
		});

		it('should add missing parameters', function () {
			var params = glitch({ amount: 10, blur: 90 }).getParams();

			for (var key in defaultParams) {
				expect(params[key]).not.to.be('undefined');
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

	describe('Asynchronous Methods', function () {
		it('should have a fromBuffer method', function () {
			expect(glitch().fromBuffer).to.be.a('function');
		});

		describe('#fromBuffer()', function () {
			it('should accept an image buffer as parameter', function (done) {
				this.timeout(10000);

				loadImageBuffer(done, function (buffer) {
					var failed = false;

					glitch()
						.fromBuffer(buffer)
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
						expect(failed).to.be(false);
						done();
					}
				});
			});

			it('should throw an error if no buffer was passed', function (done) {
				var buffer = 'lol';
				var failed = false;

				glitch()
					.fromBuffer(buffer)
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
					expect(failed).to.be(true);
					done();
				}
			});
		});

		// fromImageData

		it('should have a fromImageData method', function () {
			expect(glitch().fromImageData).to.be.a('function');
		});

		describe('#fromImageData()', function () {
			it('should be able to handle an imageData object', function (done) {
				this.timeout(20000);

				loadImageBuffer(done, function (buffer) {
					var imageData = bufferToImageData(buffer);

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
						expect(failed).to.be(false);
						done(err);
					}
				});
			});

			it('should throw an error when provided with corrupt imageData object', function (done) {
				this.timeout(10000);

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
					expect(failed).to.be(true);
					done();
				}
			});

			it('should throw an error when provided with no imageData object', function (done) {
				this.timeout(10000);

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
					expect(failed).to.be(true);
					done();
				}
			});
		});

		// fromStream

		it('should have a fromStream method', function () {
			expect(glitch().fromStream).to.be.a('function');
		});

		describe('#fromStream()', function () {
			it('should accept a readStream as input', function (done) {
				var readStream = fs.createReadStream(
					__dirname + '/' + imagePath
				);

				glitch()
					.fromStream(readStream)
					.toImageData()
					.then(function (imageData) {
						expect(imageData).to.be.an('object');
						done();
					}, done);
			});
		});

		// toDataURL

		it('should have a toDataURL method', function () {
			expect(glitch().fromBuffer().toDataURL).to.be.a('function');
		});

		describe('#toDataURL()', function () {
			it('should return a dataURL', function (done) {
				this.timeout(10000);

				loadImageBuffer(done, function (buffer) {
					glitch()
						.fromBuffer(buffer)
						.toDataURL()
						.then(function (url) {
							expect(url).to.be.a('string');
							expect(url.length).to.be.greaterThan(21);
							expect(url.indexOf('data:image/jpeg;base64')).to.be(
								0
							);
							done();
						}, done);
				});
			});
		});

		// toImageData

		it('should have a toImageData method', function () {
			expect(glitch().fromBuffer().toImageData).to.be.a('function');
		});

		describe('#toImageData()', function () {
			it('should return an imageData object', function (done) {
				this.timeout(10000);

				loadImageBuffer(done, function (buffer) {
					glitch()
						.fromBuffer(buffer)
						.toImageData()
						.then(function (imageData) {
							expect(imageData).to.be.an('object');
							expect(imageData.width).to.be.a('number');
							expect(imageData.height).to.be.a('number');
							expect(imageData.data).not.to.be('undefined');
							expect(imageData.data.length).to.be.greaterThan(0);

							done();
						}, done);
				});
			});
		});

		// toBuffer

		it('should have a toBuffer method', function () {
			expect(glitch().fromBuffer().toBuffer).to.be.a('function');
		});

		describe('#toBuffer()', function () {
			it('should return a buffer', function (done) {
				this.timeout(10000);

				loadImageBuffer(done, function (buffer) {
					glitch()
						.fromBuffer(buffer)
						.toBuffer()
						.then(function (glitchedBuffer) {
							expect(glitchedBuffer).to.be.an('object');
							expect(glitchedBuffer instanceof Buffer).to.be(
								true
							);
							done();
						}, done);
				});
			});
		});

		// toBuffer

		it('should have a toJPGStream method', function () {
			expect(glitch().fromBuffer().toJPGStream).to.be.a('function');
			expect(glitch().fromBuffer().toJPEGStream).to.be.a('function');
		});

		describe('#toJPGStream()', function () {
			it('should return a JPGStream', function (done) {
				loadImageBuffer(done, function (buffer) {
					glitch()
						.fromBuffer(buffer)
						.toJPGStream()
						.then(function (jpgStream) {
							expect(jpgStream instanceof JPEGStream).to.be(true);
							done();
						}, done);
				});
			});

			it('should send data via JPGStream', function (done) {
				loadImageBuffer(done, function (buffer) {
					glitch()
						.fromBuffer(buffer)
						.toJPGStream()
						.then(function (jpgStream) {
							var hasSentData = false;

							jpgStream.on('data', function (chunk) {
								hasSentData = !!chunk;
							});

							jpgStream.on('end', function () {
								expect(hasSentData).to.be(true);
								done();
							});

							jpgStream.on('error', done);
						}, done);
				});
			});
		});

		// toPNGStream

		describe('#toPNGStream()', function () {
			it('should return valid PNGStream', function (done) {
				loadImageBuffer(done, function (buffer) {
					glitch()
						.fromBuffer(buffer)
						.toPNGStream()
						.then(function (pngStream) {
							expect(pngStream instanceof PNGStream).to.be(true);
							done();
						}, done);
				});
			});

			it('should send data via PNGStream', function (done) {
				loadImageBuffer(done, function (buffer) {
					glitch()
						.fromBuffer(buffer)
						.toPNGStream()
						.then(function (pngStream) {
							var hasSentData = false;

							pngStream.on('data', function (chunk) {
								hasSentData = !!chunk;
							});

							pngStream.on('end', function () {
								expect(hasSentData).to.be(true);
								done();
							});

							pngStream.on('error', done);
						}, done);
				});
			});
		});
	});
});

function loadImageBuffer(err, callback) {
	fs.readFile(__dirname + '/' + imagePath, function (err, buffer) {
		if (err) {
			done(err);
			throw err;
		}

		callback(buffer);
	});
}

function bufferToImageData(buffer) {
	var img = new Image();
	img.src = buffer;

	var canvas = createCanvas(img.width, img.height);
	var ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0);

	return ctx.getImageData(0, 0, img.width, img.height);
}
