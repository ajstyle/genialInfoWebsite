// generated on 2018-01-07 using generator-webapp 3.0.1
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');
const log = require('fancy-log');
const $ = gulpLoadPlugins();
const reload = browserSync.reload;

let dev = true;

// For better data for the website.....
// [link](https://tusharghate.com/rendering-pug-templates-with-multiple-data-files)


gulp.task('views', () => {
  return gulp.src(['app/views/*.pug' ,'app/views/*.html'] )
    .pipe($.plumber())
    .pipe($.data(function(file) {
      return JSON.parse(fs.readFileSync('app/meta/site-data.json'))
    }))
    .pipe($.pug({pretty: true}))
    .pipe(gulp.dest('.tmp'))
    .pipe(reload({stream: true}));
});

gulp.task('styles', () => {
  return gulp.src('app/styles/*.{scss,css}')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.if(dev, $.sourcemaps.write()))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.babel())
    .pipe($.if(dev, $.sourcemaps.write('.')))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});

function lint(files) {
  return gulp.src(files)
    .pipe($.eslint({ fix: true }))
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js')
    .pipe(gulp.dest('app/scripts'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js')
    .pipe(gulp.dest('test/spec'));
});

gulp.task('html', ['views', 'styles', 'scripts'], () => {
  return gulp.src(['app/*.html', '.tmp/*.html'])
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
    .pipe($.if(/\.css$/, $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if(/\.html$/, $.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: {compress: {drop_console: true}},
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/fonts/**/*'))
    .pipe($.if(dev, gulp.dest('.tmp/fonts'), gulp.dest('dist/fonts')));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*',
    '!app/*.html',
    '!app/*.pug',

  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', () => {
  runSequence(['clean', 'wiredep'], ['views', 'styles', 'scripts', 'fonts'], () => {
    browserSync.init({
      notify: false,
      port: 9000,
      server: {
        baseDir: ['.tmp', 'app'],
        routes: {
          '/bower_components': 'bower_components'
        }
      }
    });

    gulp.watch([
      'app/*.html',
      'app/images/**/*',
      '.tmp/fonts/**/*'
    ]).on('change', reload);

    gulp.watch('app/**/*.pug', ['views']);
    gulp.watch('app/**/*.html', ['views']);
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
  });
});

gulp.task('serve:dist', ['default'], () => {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync.init({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch(['test/spec/**/*.js', 'test/index.html']).on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});


///////////////// Copy Other asset to the dist--- Tasks /////////////
var sourceFiles = [ './src/assets/js/*',];
var destination = './dist/';

gulp.task("copyStyleScript",()=>{
  //  gulp
  //   .src('./src/assets/images/*')
  //   .pipe(gulp.dest(destination+'/images'))

    gulp
    .src('./.tmp/scripts/*')
    .pipe(gulp.dest(destination+'/scripts'))

    gulp
    .src('./.tmp/styles/*')
    .pipe(gulp.dest(destination+'/styles'))

    gulp
    .src(['CNAME', 'robot.txt', 'sitemap.xml'])
    .pipe(gulp.dest('./dist'));
})

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe($.filter(file => file.stat && file.stat.size))
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/,
      fileTypes: {
        pug: {
          block: /(([ \t]*)\/\/-?\s*bower:*(\S*))(\n|\r|.)*?(\/\/-?\s*endbower)/gi,
          detect: {
            js: /script\(.*src=['"]([^'"]+)/gi,
            css: /link\(.*href=['"]([^'"]+)/gi
          },
          replace: {
            js: 'script(src=\'{{filePath}}\')',
            css: 'link(rel=\'stylesheet\', href=\'{{filePath}}\')'
          }
        }
      }
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/layouts/*.pug')
    .pipe(wiredep({
      exclude: ['bootstrap'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app/layouts'));
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', () => {
  return new Promise(resolve => {
    dev = false;
    runSequence(['copyStyleScript', 'wiredep'], 'build', resolve);
  });
});



/////////////// Generate SiteMap.xml////////////////
var sm = require('sitemap')
    , fs = require('fs');

    // for complete documentation.
    // Link https://www.npmjs.com/package/sitemap#example-of-mobile-url
gulp.task('sitemap',()=>{
  var site_data = JSON.parse(fs.readFileSync("app/meta/site-data.json"));
  var sitemap = sm.createSitemap({
    hostname: site_data.website,
    cacheTime: 1000*60*60,  //(7 days) cache purge period
    urls: [
        { url: '/' , changefreq: 'weekly', priority: 1, lastmodrealtime: true,
          lastmodfile: 'app/views/index.pug'
        },
       ...site_data.pages.map((page)=>({
          url: `/${page}.html` , changefreq: 'weekly', priority: 0.8, lastmodrealtime: true,
          lastmodfile: 'app/views/index.pug'
       }))
    ]
});

fs.writeFileSync("sitemap.xml", sitemap.toString());
});


gulp.task("test",()=>{
  log(JSON.parse(fs.readFileSync("app/meta/site-data.json")));
  // gulp.src('app/meta/site-data.json')
  // .pipe($.data(function(file){
  //   return
  // }))
  // .pipe(log)
  // .on('data',()=>{ log("console log data")})
  // .on('success',()=>log("on success"))
})


// write task about to fetch the bootstrap sass and put the sass into the

//app/sass/ folder


gulp.task('getBootstrap',()=>{

});
