'use strict';

const PLUGIN_NAME = 'viur-ignite-js';

const path = require('path');
const isThere = require('is-there');

const gulp = require('gulp');
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

module.exports = {
	build: function (options) {
		// Set Default Options
		var defaultOptions = {
			src: './sources/js/app.js',
			dest: './appengine/static/js'
		};

		if (typeof options === 'undefined') {
			options = {};
		}
		for (var key in defaultOptions) {
			if (typeof options[key] === 'undefined') {
				options[key] = defaultOptions[key];
			}
		}

		// minify js and put in single file
		return gulp.src([path.join(__dirname, '/js/viur.js'), options.src])
			.pipe(concat('app.js'))
			.pipe(gulp.dest(options.dest))
			.pipe(uglify())
			.pipe(rename('app.min.js'))
			.pipe(gulp.dest(options.dest));
	},

	init: function (options) {
		// Set Default Options
		var defaultOptions = {
			dest: './sources/js/app.js',
			overwrite: false
		};

		if (typeof options === 'undefined') {
			options = {};
		}
		for (var key in defaultOptions) {
			if (typeof options[key] === 'undefined') {
				options[key] = defaultOptions[key];
			}
		}

		if (isThere(options.dest) && (options.overwrite === false || options.overwrite === 'false')) {
			throw new gutil.PluginError(PLUGIN_NAME, '\'' + options.dest + '\' already exists\n\tcall function with option overwrite: true');
		} else {
			return copyPrototype(options.dest);
		}
	}
};

function copyPrototype(dest) {
	return gulp.src(path.join(__dirname, '/prototype/app.js'))
		.pipe(rename(path.basename(dest)))
		.pipe(gulp.dest(path.dirname(dest)));
}
