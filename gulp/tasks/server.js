var gulp = require('gulp'),
    argv = require('yargs').argv,
    connect = require('gulp-connect');

var env = argv.env != "production";

gulp.task('server', function() {
    if(env) {
        connect.server({
            root: './',
            port: 3333
        });
    }
});