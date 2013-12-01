// gf: http://gruntjs.com/configuring-tasks
module.exports = function( grunt )
{
	var grunt_configuration = {
		pkg: grunt.file.readJSON( 'package.json' ),
		uglify: {
			minified: {
				options: {
					preserveComments: 'some'
				},
				files: {
					'../dist/glitch-canvas.min.js': [ '../src/glitch-canvas.js' ]
				}
			},
			not_minified: {
				options: {
					preserveComments: 'some',
					compress: false,
					beautify: true,
					mangle: false
				},
				files: {
					'../dist/glitch-canvas.js': [ '../src/glitch-canvas.js' ]
				}
			}
		}
	};

	grunt.initConfig( grunt_configuration );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );

	grunt.registerTask( 'default', [ 'uglify' ] );
	grunt.registerTask( 'ugly', [ 'uglify' ] );
};