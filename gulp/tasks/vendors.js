var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');

gulp.task('vendors', function() {
    gulp.src('./src/vendor/**/*.js')
        .pipe(uglify('vendors.min.js', {
            outSourceMap: true
        }))
        .pipe(gulp.dest('./build'));
});