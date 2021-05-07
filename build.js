var fs = require( 'fs' );
var { rollup } = require( 'rollup' );
var buble = require( '@rollup/plugin-buble' );
var UglifyJS = require( 'uglify-js' );
var UglifyES = require( 'uglify-es' );
var replace = require( 'rollup-plugin-replace' );
var commonjs = require( 'rollup-plugin-commonjs' );
var nodeResolve = require( 'rollup-plugin-node-resolve' );

var program = require( 'commander' );
var version = require('./package.json').version;

program
	.version( version )
	.option('-b, --browser', 'generate browser version (node is default)' )
	.option('-e, --es6', 'export es6 code' )
	.option('-m, --minify', 'minify output' )
	.option('-u, --umd', 'export UMD Bundle (optional for es6 builds)' )
	.option('-p, --polyfill', 'add polyfills (for Promise and Object.assign)' )
	.parse( process.argv );

var env = program.browser ? 'browser' : 'node';
var isBrowser = env === 'browser';

var es5Build = ! program.es6 || env === 'node';
var minifyBuild = !! program.minify;
var bundleUMD = !! program.umd;
var polyfill = !! program.polyfill;

var globalPath = 'src/';
var buildPaths = [ 'dist/' ];
var minifyExtension = 'min';
var es6Extension = 'es6';
var umdExtension = 'umd';

var moduleName = 'glitch';
var fileName = 'glitch-canvas-{APPENDIX}';
var mainFilePath = isBrowser ? 'browser.js' : 'index.js';

if ( isBrowser ) {
	buildPaths.push( 'glitch-canvas-browser/' );
}

var stringsToReplace = {
	browser: {
		"import Canvas from './node-canvas.js'": "import Canvas from './browser.js'",
		"// PROMISE_POLYFILL_HERE": ''
	},
	node: {
		"import Canvas from 'canvas'": "var Canvas = require( 'canvas' );"
	}
};

if ( polyfill ) {
	stringsToReplace.browser[ 'const objectAssign = Object.assign' ] = "import objectAssign from 'object-assign'";

	var promisePolyfillStr = `
	import p from 'es6-promise';
	p.polyfill();
	`;
	
	stringsToReplace.browser[ '// PROMISE_POLYFILL_HERE' ] = promisePolyfillStr;
}

console.log( 'building with options: env:', env, 'es6:', ! es5Build, 'minify:', minifyBuild, 'umd', bundleUMD );

buildPaths.forEach( buildPath => {
	createES6Bundle( globalPath + mainFilePath, buildPath )
		.then( fileContent => {
			console.log( 'build complete. file saved to ' + buildPath + getOutputFileName( mainFilePath ) );
		} );
} );

function createES6Bundle ( filePath, buildPath ) {
	const format = ( es5Build || bundleUMD ) ? 'umd' : 'es';

	return processES6File( filePath, format, moduleName )
		.then( fileContent => {
			return processFileContent( fileContent );
		} )
		.then( fileContent => {
			return saveFile( buildPath + getOutputFileName( mainFilePath ), fileContent );
		} );
}

function processES6File ( filePath, format = 'es', moduleName ) {
	const rollupPlugins = [ ];

	if ( stringsToReplace[env] && Object.keys( stringsToReplace[env] ).length ) {
		const replaceOptions = {
			values: stringsToReplace[env],
			delimiters: [ '', '' ]
		};

		rollupPlugins.push( replace( replaceOptions ) );
	}

	rollupPlugins.push(
		nodeResolve(),
		commonjs()
	);
	
	if ( es5Build ) {
		rollupPlugins.push( buble() );
	}

	const rollupOptions = {
		input: filePath,
		plugins: rollupPlugins
	};

	return rollup( rollupOptions )
		.then( bundle => {
			const bundleOpts = { format };

			if ( moduleName ) {
				bundleOpts.name = moduleName;
			}

			return bundle.generate( bundleOpts )
				.then( bundleData => {
					return bundleData.output[0].code;
				} );
		} );
}

function processFileContent ( fileContent ) {
	return replaceImportedScripts ( fileContent )
		.then( fileContent => {
			return isBrowser ? workersToBlobURL( fileContent ) : workersToWorkerFunction( fileContent );
		} )
		.then( fileContent => {
			if ( minifyBuild ) {
				return compressFileContent( fileContent );
			} else {
				return fileContent;
			}
		} );
}

function loadFile ( path ) {
	return new Promise( function ( resolve, reject ) {
		fs.readFile( path, 'utf8', ( err, data ) => {
			if ( err ) {
				reject( err );
			} else {
				resolve( data );
			}
		} );
	} );
}

function saveFile ( filePath, fileContent ) {
	return new Promise( function ( resolve, reject ) {
		fs.writeFile( filePath, fileContent, 'utf8', ( err, res ) => {
			if ( err ) {
				reject( err );
			} else {
				resolve( fileContent );
			}
		} );
	} );
}

function compressFileContent ( fileContent ) {
	let res;

	if ( es5Build ) {
		res = UglifyJS.minify( fileContent );
	} else {
		res = UglifyES.minify( fileContent );
	}

	if ( res.error ) {
		console.log( res.error );
	}
	
	return res.code;
}

function replaceImportedScripts ( fileContent ) {
	let scriptPaths = getImportedScriptPaths( fileContent );

	let loadScripts = scriptPaths.map( ( scriptPath ) => {
		return loadFile( globalPath + scriptPath );
	} );

	return Promise.all( loadScripts )
		.then( ( scriptContents, scriptIndex ) => {
			return scriptContents.reduce( ( fileContent, scriptContent, scriptContentIndex ) => {
				return replaceImportedScript ( fileContent, scriptPaths[scriptContentIndex], scriptContent );
			}, fileContent );
	} );
}

function workersToBlobURL ( fileContent ) {
	const workerPaths = getWorkerPaths( fileContent );

	return Promise.all( workerPaths.map( ( workerPath ) => {
		const p = workerPath.indexOf( globalPath ) === 0 ? workerPath : globalPath + workerPath;
		
		return processES6File( p );
		// return processWorkerFile( p );
	} ) )
	.then( ( workerContents ) => {
		return workerContents.map( ( workerContent, index ) => {
			return fileToBlobURL( workerContent );
		} );
	} )
	.then( ( blobURLs ) => {
		return blobURLs.reduce( ( fileContent, blobUrl, workerIndex ) => {
			let sanitizedScriptPath = sanitizePathForRegEx( workerPaths[workerIndex] );
			let pattern = "[\'\"]" + sanitizedScriptPath + '[\'\"]';
			let regex = new RegExp( pattern, 'mig' );

			return fileContent.replace( regex, blobUrl );
		}, fileContent );
	} );
}

function workersToWorkerFunction ( fileContent ) {
	const workerPaths = getWorkerPaths( fileContent );

	return Promise.all( workerPaths.map( ( workerPath ) => {
		const p = workerPath.indexOf( globalPath ) === 0 ? workerPath : globalPath + workerPath;
		
		return processES6File( p );
	} ) )
	.then( ( workerContents ) => {
		return workerContents.map( ( workerContent, index ) => {
			return fileToWorkerFunction( workerContent );
		} );
	} )
	.then( ( workerFunctionStrings ) => {
		return workerFunctionStrings.reduce( ( fileContent, workerFunctionString, workerIndex ) => {
			let sanitizedScriptPath = sanitizePathForRegEx( workerPaths[workerIndex] );
			let pattern = "[\'\"]" + sanitizedScriptPath + '[\'\"]';
			let regex = new RegExp( pattern, 'mig' );

			return fileContent.replace( regex, workerFunctionString );
		}, fileContent );
	} );
}

function fileToBlobURL ( fileContent, type = 'text/javascript' ) {
	if ( minifyBuild ) {
		fileContent = compressFileContent( fileContent );
	}
	
	const fileContentStr = JSON.stringify( fileContent );

	return "URL.createObjectURL(new Blob([" + fileContentStr + "],{type:'" + type + "'}))";
}

function fileToWorkerFunction ( fileContent ) {
	if ( minifyBuild ) {
		fileContent = compressFileContent( fileContent );
	}

	return "function(){\n" + fileContent + "\n}";
}

function getWorkerPaths ( fileContent ) {
	// let regex = /[\'\”](.*Worker.js)[\'\”]/mig;
	const regex = /new Worker\s?\(\s?([\"\'][a-zA-Z0-9\/.+=-]+)[\"\']\s?\)/g;

	let matches;
	let result = [ ];

	while  ( ( matches = regex.exec( fileContent ) ) !== null ) {
		// This is necessary to avoid infinite loops with zero-width matches
		if ( matches.index === regex.lastIndex ) {
			regex.lastIndex++;
		}
		
		// The result can be accessed through the `m`-variable.
		matches.forEach( ( match, groupIndex ) => {
			if ( groupIndex === 1 ) {
				result.push( match );
			}
		} );
	}

	return result.map( path => {
		return path.replace( /[\'\"]/g, '' );
	});
}

function getImportedScriptPaths ( fileContent ) {
	// let regex = /(importScripts|\(|"|')([a-zA-Z0-9\/\_\-]*\.js)/mig;
	let regex = /importScripts\([\"\'\s]+([a-zA-Z0-9\/\_\-]*\.js)[\"\'\s]+\)/mig;

	let matches;
	let result = [ ];

	while  ( ( matches = regex.exec( fileContent ) ) !== null ) {
		// This is necessary to avoid infinite loops with zero-width matches
		if ( matches.index === regex.lastIndex ) {
			regex.lastIndex++;
		}
		
		// The result can be accessed through the `m`-variable.
		matches.forEach( ( match, groupIndex ) => {
			if ( groupIndex === 1 ) {
				result.push( match );
			}
		} );
	}

	return result;
}

function replaceImportedScript ( fileContent, scriptPath, scriptContent ) {
	let sanitizedScriptPath = sanitizePathForRegEx( scriptPath );
	let pattern = 'importScripts.*' + sanitizedScriptPath +  '*.*\;';
	let regex = new RegExp( pattern, 'mig' );

	let res = fileContent.replace( regex, scriptContent );

	return res;
}

function sanitizePathForRegEx ( path ) {
	return path
		.replace( /\//g, '\\/' )
		.replace( /\-/g, '\\-' )
		.replace( /\(/g, '\\(' )
		.replace( /\"/g, '\\"' )
		.replace( /\./g, '\\.' );
}

function getOutputFileName ( filePath ) {
	let appendix = env;

	if ( polyfill ) {
		appendix += '-with-polyfills';
	}

	if ( ! es5Build && es6Extension && es6Extension.length ) {
		appendix += '.' + es6Extension;
	}

	if ( bundleUMD && ! es5Build ) {
		appendix += '.' + umdExtension;
	}

	if ( minifyBuild ) {
		appendix += '.' + minifyExtension;
	}


	return fileName.replace( '{APPENDIX}', appendix ) + '.js';
}