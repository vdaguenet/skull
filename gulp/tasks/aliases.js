var gulp = require('gulp');
// browserSync = require('browser-sync'),
// reload = browserSync.reload;

gulp.task('default', ['clean', 'styles', 'watch', 'server']);
// gulp.task('dist', ...

// Watch Files For Changes & Reload
// gulp.task('serve', ['clean', 'jshint', 'styles', 'watch'], function () {
//     browserSync.init(null, {
//         watchTask: true,
//         proxy: "patchwork.dev", //REMPLACE WITH YOUR VHOST
//         notify: false
//     });


//     gulp.watch(['./build/**/*.*'], reload);



// });