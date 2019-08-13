const gulp = require('gulp');

const connect = require('gulp-connect');

const proxy = require('http-proxy-middleware');

const postcss = require('gulp-postcss');

const autoprefixer = require('autoprefixer');

const sass = require('gulp-sass');

sass.compiler = require('node-sass');


gulp.task('sass', function () {
  return gulp.src('./style/scss/*.scss')
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(postcss([autoprefixer({browsers: ['last 2 versions', 'Android >= 4.0']})]))  // 自动添加 css3 兼容前缀,主流浏览器最新的两个
    .pipe(gulp.dest('./style/css/'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./style/scss/*.scss', ['sass']);
});

gulp.task('server', function () {
  connect.server({
    root: "./",
    port: 8080,
    livereload : true,
    // 配置代理
    middleware() {
      return [
        proxy('/api', {
          target: 'http://www.baidu.com/',
          // changeOrigin: true,
          changeOrigin: true,
          ws: false,
          wss : false,
        })
      ]
    }
  })
});

let htmlDir = '*.html'
gulp.task('watch-html', function() {
  gulp.watch(htmlDir, ['html']);
});

gulp.task('html', function() {
  gulp.src(htmlDir).pipe(connect.reload());
});


gulp.task('default', ['server','watch-html', 'sass:watch'], function () {
  console.log('gulp start');
});