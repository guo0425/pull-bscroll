const gulp = require('gulp');
const webserver = require('gulp-webserver');
const sass = require('gulp-sass');

gulp.task('devSass', () => {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'));
});
gulp.task('server', () => {
    return gulp.src('./src')
        .pipe(webserver({
            port: 8989,
            proxies: [{
                    source: '/users/getdata',
                    target: 'http://localhost:3000/users/getdata'
                },
                {
                    source: '/users/alldata',
                    target: 'http://localhost:3000/users/alldata'
                },
                {
                    source: '/users/icedata',
                    target: 'http://localhost:3000/users/alldata'
                }, {
                    source: '/users/samedata',
                    target: 'http://localhost:3000/users/alldata'
                }
            ]
        }))
});
gulp.task('watching', () => {
    gulp.watch('./src/scss/**/*.scss', gulp.series('devSass'));
});
gulp.task('default', gulp.series('devSass', 'server', 'watching'));