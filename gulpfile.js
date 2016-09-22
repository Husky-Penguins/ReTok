'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
  gulp.src('./client/styles/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./client/styles/css'));
});


gulp.task('sass:watch', function () {
  gulp.watch('./client/styles/scss/*.scss', ['sass']);
});