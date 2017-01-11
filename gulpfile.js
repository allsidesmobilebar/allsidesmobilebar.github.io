// Gulp modules
var browserSync  = require('browser-sync').create()
,   gulp         = require('gulp')
,   concat       = require('gulp-concat')
,   sass         = require('gulp-sass')
,   sourcemaps   = require('gulp-sourcemaps')
,   uglify       = require('gulp-uglify')
,   autoprefixer = require('gulp-autoprefixer')
,   imagemin     = require('gulp-imagemin')
,   useref       = require('gulp-useref')
;


// Paths
path.siteroot = '/';
path.assets   = path.siteroot  + 'assets';
path.css      = path.assets + 'css';
path.js       = path.assets + 'js';
path.bower    = __dirname   + '/bower_components';

var browserSyncWatchedFiles = [
  path.siteroot + '/**/*.html',
  path.js       + '/**/*.js',
];


/**
 * Styles
 */
// Watch and compile Sass
gulp.task('sass:watch', ['sass'], function() {
  gulp.watch(files.scss, ['sass']);
});

// Compile Scss files
gulp.task('sass', function() {
  gulp
    .src(files.scss)
    .pipe(replace('<bower_components>', slash(path.bower)))
    .pipe(isProduction ? gutil.noop() : insert.prepend('$dev-mode: true;'))
    .pipe(isProduction ? gutil.noop() : sourcemaps.init())
    .pipe(sass({outputStyle: isProduction ? 'compressed' : 'expanded'}).on('error', sass.logError))
    .pipe(isProduction ? gutil.noop() : sourcemaps.write({includeContent: false}))
    .pipe(isProduction ? gutil.noop() : sourcemaps.init({loadMaps: true}))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'android 4'],
    }))
    .pipe(isProduction ? gutil.noop() : sourcemaps.write('.'))
    .pipe(flatten())
    .pipe(isProduction ? rename({ suffix: '.min' }) : gutil.noop())
    .pipe(gulp.dest(path.dest + '/assets/css'))
    .pipe(browserSync.reload({
      stream: true,
      match: '**/*.css'
    }));
});

/**
 * Browser Sync
 */
gulp.task('browser-sync', function() {
  browserSync.init({
    // server: {
    //   baseDir: 'public'
    // },
    socket: {
      domain: devip()[0] + ':3000'
    },
    port: 3000,
    open: false,
    online: false,
    notify: false,
  });
  gulp
    .watch(browserSyncWatchedFiles)
    .on('change', browserSync.reload);
  gulp.watch(files.scss, ['sass']);
});

var tasks = [
  'js',
  'dependencies',
  'sass'
];

/**
 * Default Gulp Task
 */
gulp.task('default', tasks);

/**
 * Browser Sync Alias
 */
gulp.task('sync', ['browser-sync']);
