module.exports = function(grunt) {

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("package.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.license %> License\n" +
				" */\n"
		},

		// Concat definitions
		concat: {
			options: {
				banner: "<%= meta.banner %>"
			},
			dist: {
				src: ["src/jquery.gmapify.js"],
				dest: "dist/jquery.gmapify.js"
			}
		},

		// Lint definitions
		jshint: {
			files: ["src/jquery.gmapify.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
				src: ["dist/jquery.gmapify.js"],
				dest: "dist/jquery.gmapify.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		copy: {
		  main: {
		    files: [
		      {expand: true, cwd: 'css/', src: ['**'], dest: '../gh-pages/css/'},
		      {expand: true, cwd: 'src/', src: ['**'], dest: '../gh-pages/js/'},
		    ],
		  },
		},

		// watch for changes to source
		// Better than calling grunt a million times
		// (call 'grunt watch')
		watch: {
			options: {
	            spawn: false,
	        },
		    files: ['src/*', 'css/*'],
		    tasks: ['default']
		}

	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask("build", ["concat", "uglify", "copy"]);
	grunt.registerTask("default", ["jshint", "build"]);
	grunt.registerTask("travis", ["default"]);

};
