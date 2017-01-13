var gulp         = require('gulp')
  , browserSync  = require('browser-sync').create()
  , sass         = require('gulp-sass')
  , autoprefixer = require('gulp-autoprefixer')
  , replace      = require('gulp-replace')
  , slash        = require('gulp-slash')

  , path = {}
  ;

// paths
path.siteroot = './';
path.assets = path.siteroot + '/assets';
path.css    = path.assets   + '/css';
path.scss   = path.css      + '/scss';
path.img    = path.assets   + '/img';
path.js     = path.assets   + '/js';
path.bower  = __dirname     + '/bower_components';


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

  browserSync.init({
    server: path.siteroot
  });

  gulp.watch(path.scss + "/**/*.scss", ['sass']);
  gulp.watch("*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src(path.scss + "/**/*.scss")
    .pipe(replace('<bower_components>', slash(path.bower)))
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'android 4'],
      cascade: false
    }))
    .pipe(gulp.dest(path.css))
    .pipe(browserSync.stream());
});


gulp.task('default', ['serve']);
