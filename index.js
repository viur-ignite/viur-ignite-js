var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var path = require('path');
var fileExists = require('file-exists');
var prompt = require('prompt');


module.exports = {
	build: function(src, dest) {
		if (typeof(src)==='undefined') src = '/sources/js/app.js';
		if (typeof(dest)==='undefined') dest = '/appengine/static/js/';

		src = dirname(dirname(__dirname)) + src; 
		dest = dirname(dirname(__dirname)) + dest;

		// minify js and put in single file
		return gulp.src([__dirname+'/js/viur.js', src])
			.pipe(concat('app.js'))
			.pipe(uglify())
			.pipe(gulp.dest(dest))
	},

	init: function() {
		if(fileExists('./sources/js/app.js')) { 
			setTimeout(function() {

				prompt.start();

				var property = {
					name: 'yesno',
					message: 'Are you sure to overwrite app.js in sources/js/?',
					validator: /y[es]*|n[o]?/,
					warning: 'Must respond yes or no',
					default: 'no'
				};

				prompt.get(property, function (err, result) {
					console.log('Your Input: ' + result.yesno);

					if(result.yesno == "yes" || result.yesno == "y") {
						prompt.stop();
						return copyPrototype();
					} else {
						prompt.stop();
						return false;
					}
				});

			}, 5);
		} else {
			return copyPrototype();
		}
	}
};

function dirname(path) {
	return path.replace(/\\/g, '/')
		.replace(/\/[^\/]*\/?$/, '');
}
function copyPrototype() {
	return gulp.src(__dirname+'/prototype/app.js')
		.pipe(rename('app.js'))
		.pipe(gulp.dest('./sources/js'));
}