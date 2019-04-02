// https://stackoverflow.com/a/30777737
function mergeFilesWithArgv ( staticFiles ) {
	const source = staticFiles;
	const argv = process.argv;

	argv.forEach( arg => {
		const index = arg.indexOf( '--lib=' );
		
		if ( index !== -1 ) {
			source.unshift( '../dist/' + arg.substring( 6 ) );
		}
	} );

	return source;
}

module.exports = function ( config ) {
	config.set( {
		frameworks: [ 'mocha', 'chai' ],
		files: mergeFilesWithArgv( [
			'./test-browser.js',
			{
				pattern: 'img/*.jpg',
				included: false
			}
		] ),
		reporters: [ 'progress' ],
		port: 9876,  // karma web server port
		colors: true,
		logLevel: config.LOG_INFO,
		browsers: [ 'ChromeHeadless' ],
		autoWatch: false,
		concurrency: Infinity
	} );
};
