var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    babel = require('gulp-babel');

var DEST = '/';

gulp.task('babel', function() {
    return gulp.src("src/*.js")
        .pipe(concat('index.js'))
        .pipe(babel())
      	.pipe(gulp.dest(''));
});




gulp.task('watch', function() {
  // Watch .js files
  gulp.watch('src/*.js', ['babel']);
});

// Default Task
gulp.task('default', ['watch']);