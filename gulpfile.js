var gulp = require("gulp");
var gutil = require("gulp-util");

//*****************************************************************//
gulp.task("static", function() {
    gulp.src("src/css/**/*.css")
        .pipe(gulp.dest("dist/css"));
    gulp.src("src/data/**")
        .pipe(gulp.dest("dist/data"));
});
//*****************************************************************//
var jade = require("gulp-jade");
var jadeConf = {
    watch: "src/jade/compile/",
    src: "src/jade/compile/**/*.jade",
    dest: "dist/"
};
gulp.task("jade", function() {
    var LOCALS = {
        pretty: true
    };

    gulp.src(jadeConf.src)
        .pipe(jade({
            locals: LOCALS
        }))
        .pipe(gulp.dest(jadeConf.dest));
});
//*****************************************************************//
var concat = require('gulp-concat');
var uglify = require("gulp-uglify");
gulp.task('compileJs', function() {
    gulp.src('src/js/*.js')
        .pipe(gulp.dest('test/js/'));
    
    gulp.src('src/js/*.js')
        .pipe(concat('jquery.item-selector.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));

    gulp.src('src/js/*.js')
        .pipe(concat('jquery.item-selector.js'))
        .pipe(gulp.dest('dist/js/'));
});
//*****************************************************************//
gulp.task("default", [
    "static",
    "jade",
    "compileJs"], function () {
});
//*****************************************************************//
