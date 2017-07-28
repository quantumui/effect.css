"use strict";

var gulp = require("gulp"),
  del = require("del"),
  concat = require("gulp-concat"),
  cssmin = require("gulp-cssmin"),
  uglify = require("gulp-uglify"),
  less = require("gulp-less"),
  watch = require("gulp-watch"),
  watch_less = require("gulp-watch-less"),
  rename = require("gulp-rename"),
  rewriteCSS = require('gulp-rewrite-css'),
  Q = require('q');

var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

var config = {
    src: {
        LESS: "./less/",
        JS: "./scripts/",
    },
    dist: {
        JS: "./dist/js/",
        CSS: "./dist/",
        CUSTOM: "./dist/custom"
    }
};

gulp.task("clean:js", function (cb) {
    var paths = del.sync(['dist/js/*.js']);
    console.log('Files and folders that would be deleted:\n', paths.join('\n'));
});
gulp.task("clean:css", function (cb) {
    var paths = del.sync(['dist/*.css']);
    console.log('Files and folders that would be deleted:\n', paths.join('\n'));
});
gulp.task("clean:custom", function (cb) {
    var paths = del.sync(['dist/custom/*.css']);
    console.log('Files and folders that would be deleted:\n', paths.join('\n'));
});
gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task('less', function () {
    return Q.all([
     gulp.src(config.src.LESS + 'effects-all.less')
            .pipe(less({
                plugins: [autoprefix],
                filename: 'effects-all.css'
            }))
           .pipe(gulp.dest(config.dist.CSS))
           .pipe(cssmin())
           .pipe(rewriteCSS({ destination: config.dist.CSS }))
           .pipe(rename({ suffix: '.min' }))
           .pipe(gulp.dest(config.dist.CSS)),
     gulp.src(config.src.LESS + 'effects-all-angular.less')
            .pipe(less({
                plugins: [autoprefix],
                filename: 'effects-all-angular.css'
            }))
           .pipe(gulp.dest(config.dist.CSS))
           .pipe(cssmin())
           .pipe(rename({ suffix: '.min' }))
           .pipe(rewriteCSS({ destination: config.dist.CSS }))
           .pipe(gulp.dest(config.dist.CSS)),
    gulp.src(config.src.LESS + 'effects-all-react.less')
            .pipe(less({
                plugins: [autoprefix],
                filename: 'effects-all-react.css'
            }))
           .pipe(gulp.dest(config.dist.CSS))
           .pipe(cssmin())
           .pipe(rename({ suffix: '.min' }))
           .pipe(rewriteCSS({ destination: config.dist.CSS }))
           .pipe(gulp.dest(config.dist.CSS)),
    gulp.src(config.src.LESS + 'effects-custom.less')
            .pipe(less({
                plugins: [autoprefix],
                filename: 'effects-custom.css'
            }))
           .pipe(gulp.dest(config.dist.CSS))
           .pipe(cssmin())
           .pipe(rename({ suffix: '.min' }))
           .pipe(rewriteCSS({ destination: config.dist.CSS }))
           .pipe(gulp.dest(config.dist.CSS))
    ]).then(function () {
        console.log('Commons are written...');
    })
});
gulp.task('js', function () {

    return Q.all([
       gulp.src(config.src.JS + 'jquery.effectcss.js')
            .pipe(gulp.dest(config.dist.JS))
            .pipe(uglify())
            .pipe(rename({ extname: '.min.js' }))
            .pipe(gulp.dest(config.dist.JS)),
       gulp.src(config.src.JS + 'jquery.bootstrap-effectcss.js')
            .pipe(gulp.dest(config.dist.JS))
            .pipe(uglify())
            .pipe(rename({ extname: '.min.js' }))
            .pipe(gulp.dest(config.dist.JS))
    ]).then(function () {
        console.log('Commons are written...');
    })
});

gulp.task('custom:less', function () {
   return gulp.src(config.src.LESS + 'effects-custom.less')
              .pipe(less({
                  plugins: [autoprefix],
                  filename: 'effects-custom.css'
              }))
             .pipe(gulp.dest(config.dist.CUSTOM))
             .pipe(rewriteCSS({ destination: config.dist.CUSTOM }))
             .pipe(cssmin())
             .pipe(rename({ suffix: '.min' }))
             .pipe(gulp.dest(config.dist.CUSTOM))
});
gulp.task("dist", ["clean", "less", "js"]);
gulp.task("custom", ["clean:custom", "custom:less"]);
