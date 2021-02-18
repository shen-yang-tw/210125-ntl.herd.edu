'use strict';
// node.js Packages / Dependencies
const gulp = require('gulp');
const sass = require('gulp-dart-sass');
// const uglify = require('gulp-uglify');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const imageMin = require('gulp-imagemin');
const pngQuint = require('imagemin-pngquant');
const browserSync = require('browser-sync').create();
const gulpautoprefixer = require('gulp-autoprefixer');
const jpgRecompress = require('imagemin-jpeg-recompress');

const inject = require('gulp-inject');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const purgecss = require("@fullhuman/postcss-purgecss");
const tailwindcss = require("tailwindcss");
const atimport = require("postcss-import");
const del = require("del");
const replace = require('gulp-replace');
var handlebars = require('gulp-compile-handlebars');
var merge = require('merge-stream');

//Mode
// const mode = require('gulp-mode')(); //last '()' means a function must be needed or get err
const mode = require('gulp-mode')({
  modes: ["production", "development", "purge"],
  default: "development",
  verbose: false
});

const uk='true', fa='true', bs='true', jq='true'

// Paths
var paths = {
  root: {
    www: './src'
  },
  vendors: {
    ukjs: ['node_modules/uikit/dist/js/uikit.min.js', 'node_modules/uikit/dist/js/uikit-icons.min.js'],
    bsjs: ['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js'],
    ukcss: ['node_modules/uikit/dist/css/uikit.min.css'],
    bscss: ['node_modules/bootstrap/dist/css/bootstrap.min.css'],
    jq: ['node_modules/jquery/dist/jquery.min.js'], //jQuery
    // fittext: ['node_modules/FitText-UMD/fittext.js'], //FitText
    fsfonts: ['node_modules/@fortawesome/fontawesome-free/webfonts/*'],
    bsfonts: ['node_modules/bootstrap/dist/fonts/*'], //Bootstrap
    fontawesome: ['node_modules/@fortawesome/fontawesome-free/css/all.min.css'],
  },
  // template: '',
  src: {
    root: './src/',
    templates: 'src/templates/*.hbs',
    html: 'src/*.html',
    css: 'src/css/*.css',
    js: 'src/js/*.js',
    vendors: 'src/libs/**/*.*',
    img: 'src/img/**/*.+(png|jpg|gif|svg)',
    scss: 'src/scss/*.scss'
  },
  dist: {
    root: './dist/',
    templates: 'templates',
    html: 'dist/*.html',
    scss: 'scss',
    css: 'css',
    js: 'js',
    img: 'img',
    fsfont: 'webfonts',
    bsfont: 'fonts',
    vendors: 'libs'
  }
}

// Output tailwind css
gulp.task('tailwind', function() {
  return gulp.src('tailwind.css')
    .pipe(mode.development(
      postcss([
        atimport(),
        tailwindcss("tailwind.config.js"),
        autoprefixer()
      ])
    ))
    .pipe(mode.production(
      postcss([
        atimport(),
        tailwindcss("tailwind.config.js"),
        autoprefixer()
      ])
    ))
    //Minify css
    .pipe(mode.production(
      cleanCSS({
        compatibility: 'ie8'
      })
    ))
    .pipe(mode.production(
      rename({
        suffix: '.min'
      })
    ))
    .pipe(mode.purge(
      postcss([
        atimport(),
        tailwindcss("tailwind.config.js"),
        purgecss({ // Using '@fullhuman/postcss-purgecss'
          content: [paths.src.html, paths.src.js], // Must be necessary with 'tailwind.config.js'
          // defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
          defaultExtractor: content => content.match(/[\w-/:!@]+(?<!:)/g) || []
        }),
        autoprefixer()
      ])
    ))
    //Minify css
    .pipe(mode.purge(
      cleanCSS({
        compatibility: 'ie8'
      })
    ))
    .pipe(mode.purge(
      rename({
        suffix: '.min'
      })
    ))
    // .pipe(mode.development(
    //   rename({
    //     suffix: '.min'
    //   })
    // ))

    //Minify css
    // .pipe(cleanCSS({
    //   compatibility: 'ie8'
    // }))
    // .pipe(rename({
    //   suffix: '.min'
    // }))

    .pipe(mode.development(gulp.dest(paths.src.root + paths.dist.css)))
    .pipe(mode.production(gulp.dest(paths.dist.root + paths.dist.css)))
    .pipe(mode.purge(gulp.dest(paths.dist.root + paths.dist.css)))
  // .pipe(mode.production(gulp.dest(paths.dist.root + paths.dist.css)))
  // .pipe(gulp.dest(paths.src.root + paths.dist.vendors))
  // .pipe(gulp.dest(paths.dist.root + paths.dist.vendors))
});

gulp.task('othercss', function() {
  return gulp.src([paths.src.root + paths.dist.css + '/jquery-ui.css'])
    .pipe(gulp.dest(paths.dist.root + paths.dist.css))
  // .pipe(mode.production(gulp.dest(paths.dist.vendors)))
})

if (uk) {
  gulp.task('ukjs', function() {
  return gulp.src(paths.vendors.ukjs)
    .pipe(gulp.dest(paths.src.root + paths.dist.js))
    .pipe(gulp.dest(paths.dist.root + paths.dist.js))
  // .pipe(mode.production(gulp.dest(paths.dist.vendors)))
  })
  gulp.task('ukcss', function() {
    return gulp.src(paths.vendors.ukcss)
      // Find digits between "font-size:" and "px" in Visual Studio Code using: "font-size:(\d+)px" or "font-size:\s+(\d+)px"
      //\d+ means one or more digits, \s means one or more whitespaces
      // .pipe(replace('font-size:12px', 'font-size:calc(12rem/16)'))
      .pipe(replace(/font-size:(\d+)px/g, function(match) {
        return "font-size:calc(" + match.slice(10, -2) + "rem/16)"
      }))
      .pipe(gulp.dest(paths.src.root + paths.dist.css))
      .pipe(gulp.dest(paths.dist.root + paths.dist.css))
    // .pipe(gulp.dest(paths.dist.root + paths.dist.css))
  })
}
if (fa) {
  gulp.task('fontawesome', function() {
    return gulp.src(paths.vendors.fontawesome)
      .pipe(rename("fontawesome.min.css"))
      .pipe(gulp.dest(paths.src.root + paths.dist.css))
      .pipe(gulp.dest(paths.dist.root + paths.dist.css))
  })
  gulp.task('fsfonts', function() {
    return gulp.src(paths.vendors.fsfonts)
      .pipe(gulp.dest(paths.src.root + paths.dist.fsfont))
      .pipe(gulp.dest(paths.dist.root + paths.dist.fsfont))
  })
}
if (bs) {
  gulp.task('bsjs', function() {
  return gulp.src(paths.vendors.bsjs)
    .pipe(gulp.dest(paths.src.root + paths.dist.js))
    .pipe(gulp.dest(paths.dist.root + paths.dist.js))
  // .pipe(mode.production(gulp.dest(paths.dist.vendors)))
  })
  gulp.task('bscss', function() {
    return gulp.src(paths.vendors.bscss)
      .pipe(replace(/font-size:(\d+)px/g, function(match) {
        return "font-size:calc(" + match.slice(10, -2) + "rem/16)"
      }))
      .pipe(gulp.dest(paths.src.root + paths.dist.css))
      .pipe(gulp.dest(paths.dist.root + paths.dist.css))
  })
  gulp.task('bsfonts', function() {
    return gulp.src(paths.vendors.bsfonts)
      .pipe(gulp.dest(paths.src.root + paths.dist.bsfont))
      .pipe(gulp.dest(paths.dist.root + paths.dist.bsfont))
  })
}
if (jq) {
  gulp.task('jqjs', function() {
  return gulp.src(paths.vendors.jq)
    .pipe(gulp.dest(paths.src.root + paths.dist.js))
    .pipe(gulp.dest(paths.dist.root + paths.dist.js))
  // .pipe(mode.production(gulp.dest(paths.dist.vendors)))
  })
}

// gulp.task('copyfonts', function() {
//   var bootstrap = gulp.src(paths.vendors.bsfonts)
//   .pipe(gulp.dest(paths.src.root + paths.dist.bsfont))
//   .pipe(gulp.dest(paths.dist.root + paths.dist.bsfont))

//   var fontawesome = gulp.src(paths.vendors.fonts)
//   .pipe(gulp.dest(paths.src.root + paths.dist.font))
//   .pipe(gulp.dest(paths.dist.root + paths.dist.font))
//   return merge(fontawesome, bootstrap);
// });

//Handlebars templates
//gulp.task('templates', async function(){}): It must need the 'async' or get error 'Did you forget to signal async completion?'
gulp.task('templates', async function() {
  var templateData = {
      title: '國立臺灣圖書館-本土教育資源中心',
      // focus: 'true' //Add the class 'focus' to <body> for AA,
      jqueryBody: 'true',
      bootstrapBody: 'true'
    },
    options = {
      batch: [paths.src.root + paths.dist.templates + '/partials'],
    }
  gulp.src([paths.src.templates, '!' + paths.src.root + paths.dist.templates + '/*-i.hbs'])
    .pipe(handlebars(templateData, options))
    // .pipe(rename('hello.html'))
    .pipe(rename({
      extname: ".html"
    }))
    .pipe(gulp.dest(paths.src.root))
    .pipe(gulp.dest(paths.dist.root))
});

// clean dist and keep the directory
gulp.task('delhtml', function() {
  return del([paths.src.root + '*.html']);
});

// inject css & js to html - https://www.npmjs.com/package/gulp-inject#method-2-use-gulp-inject-s-name-option
gulp.task('inject', function() {
  return gulp.src(paths.src.html)
    .pipe(inject(gulp.src([paths.src.root + paths.dist.css + '/bootstrap*.css'], {
      read: false
    }), {
      name: 'bs',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src([paths.src.root + paths.dist.css + '/uikit*.css'], {
      read: false
    }), {
      name: 'uk',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src([paths.src.root + paths.dist.css + '/tailwind*.css'], {
      read: false
    }), {
      name: 'tw',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src([paths.src.root + paths.dist.css + '/font*.css'], {
      read: false
    }), {
      name: 'fa',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src([paths.src.root + paths.dist.css + '/main.css'], {
      read: false
    }), {
      name: 'main',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src([paths.src.root + paths.dist.css + '/colors.css'], {
      read: false
    }), {
      name: 'colors',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src([paths.src.root + paths.dist.css + '/style.css'], {
      read: false
    }), {
      name: 'style',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src([paths.src.root + paths.dist.css + '/style-*.css'], {
      read: false
    }), {
      name: 'style2',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src([paths.src.root + paths.dist.css + '/jquery-ui.css'], {
      read: false
    }), {
      name: 'head',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src([paths.src.root + paths.dist.css + '/*.css', '!' + paths.src.root + paths.dist.css + '/bootstrap*.css', '!' + paths.src.root + paths.dist.css + '/ui*.css', '!' + paths.src.root + paths.dist.css + '/ta*.css', '!' + paths.src.root + paths.dist.css + '/font*.css', '!' + paths.src.root + paths.dist.css + '/main*.css', '!' + paths.src.root + paths.dist.css + '/colors*.css', '!' + paths.src.root + paths.dist.css + '/style*.css'], {
      read: false
    }), {
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src(paths.src.root + paths.dist.js + '/uikit.min.js', {
      read: false
    }), {
      name: 'uk',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src(paths.src.root + paths.dist.js + '/uikit-icons.min.js', {
      read: false
    }), {
      name: 'uk2',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src(paths.src.root + paths.dist.js + '/jquery.min.js', {
      read: false
    }), {
      name: 'jq',
      relative: true,
      removeTags: true
    }))
    // .pipe(inject(gulp.src(paths.src.root + paths.dist.js + '/jquery.min.js', {
    //   read: false
    // }), {
    //   name: 'jq-defer',
    //   relative: true,
    //   removeTags: true,
    //   transform: function(filepath) {
    //     return '<script src="' + filepath + '" defer>' + '</script>';
    //   }
    // }))
    .pipe(inject(gulp.src(paths.src.root + paths.dist.js + '/bootstrap*.js', {
      read: false
    }), {
      name: 'bs',
      relative: true,
      removeTags: true
    }))
    // .pipe(inject(gulp.src(paths.src.root + paths.dist.js + '/bootstrap*.js', {
    //   read: false
    // }), {
    //   name: 'bs',
    //   relative: true,
    //   removeTags: true,
    //   transform: function(filepath) {
    //     return '<script src="' + filepath + '" defer>' + '</script>';
    //   }
    // }))
    // .pipe(inject(gulp.src([paths.src.root + paths.dist.js + '/script.js'], {
    //   read: false
    // }), {
    //   name: 'head',
    //   relative: true,
    //   removeTags: true,
    //   transform: function(filepath) {
    //     return '<script src="' + filepath + '" defer>' + '</script>';
    //   }
    // }))
    .pipe(inject(gulp.src([paths.src.root + paths.dist.js + '/*.js', '!' + paths.src.root + paths.dist.js + '/script*.js', '!' + paths.src.root + paths.dist.js + '/jquery*.js', '!' + paths.src.root + paths.dist.js + '/bootstrap*.js', '!' + paths.src.root + paths.dist.js + '/ui*.js', '!' + paths.src.root + paths.dist.js + '/*-i.js'], {
      read: false
    }), {
      relative: true,
      removeTags: true,
      transform: function(filepath) {
        return '<script src="' + filepath + '" defer>' + '</script>';
      }
    }))
    .pipe(gulp.dest(paths.src.root))
  // .pipe(gulp.dest(paths.dist.root))
});

gulp.task('build-inject', function() {
  return gulp.src(paths.dist.html)
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.css + '/bootstrap*.css'], {
      read: false
    }), {
      name: 'bs',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.css + '/uikit*.css'], {
      read: false
    }), {
      name: 'uk',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.css + '/tailwind*.css'], {
      read: false
    }), {
      name: 'tw',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.css + '/font*.css'], {
      read: false
    }), {
      name: 'fa',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.css + '/main*.css'], {
      read: false
    }), {
      name: 'main',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.css + '/colors*.css'], {
      read: false
    }), {
      name: 'colors',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.css + '/style.min.css'], {
      read: false
    }), {
      name: 'style',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.css + '/style-*.css'], {
      read: false
    }), {
      name: 'style2',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.css + '/jquery-ui.css'], {
      read: false
    }), {
      name: 'head',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.css + '/*.css', '!' + paths.dist.root + paths.dist.css + '/bootstrap*.css', '!' + paths.dist.root + paths.dist.css + '/ui*.css', '!' + paths.dist.root + paths.dist.css + '/ta*.css', '!' + paths.dist.root + paths.dist.css + '/font*.css', '!' + paths.dist.root + paths.dist.css + '/main*.css', '!' + paths.dist.root + paths.dist.css + '/colors*.css', '!' + paths.dist.root + paths.dist.css + '/style*.css'], {
      read: false
    }), {
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src(paths.dist.root + paths.dist.js + '/uikit.min.js', {
      read: false
    }), {
      name: 'uk',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src(paths.dist.root + paths.dist.js + '/uikit-icons.min.js', {
      read: false
    }), {
      name: 'uk2',
      relative: true,
      removeTags: true
    }))
    .pipe(inject(gulp.src(paths.dist.root + paths.dist.js + '/jquery.min.js', {
      read: false
    }), {
      name: 'jq',
      relative: true,
      removeTags: true
    }))
    // .pipe(inject(gulp.src(paths.dist.root + paths.dist.js + '/jquery.min.js', {
    //   read: false
    // }), {
    //   name: 'jq-defer',
    //   relative: true,
    //   removeTags: true,
    //   transform: function(filepath) {
    //     return '<script src="' + filepath + '" defer>' + '</script>';
    //   }
    // }))
    .pipe(inject(gulp.src(paths.dist.root + paths.dist.js + '/bootstrap*.js', {
      read: false
    }), {
      name: 'bs',
      relative: true,
      removeTags: true
    }))
    // .pipe(inject(gulp.src(paths.dist.root + paths.dist.js + '/bootstrap*.js', {
    //   read: false
    // }), {
    //   name: 'bs',
    //   relative: true,
    //   removeTags: true,
    //   transform: function(filepath) {
    //     return '<script src="' + filepath + '" defer>' + '</script>';
    //   }
    // }))
    // .pipe(inject(gulp.src([paths.dist.root + paths.dist.js + '/script*.js'], {
    //   read: false
    // }), {
    //   name: 'head',
    //   relative: true,
    //   removeTags: true,
    //   transform: function(filepath) {
    //     return '<script src="' + filepath + '" defer>' + '</script>';
    //   }
    // }))
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.js + '/*.js', '!' + paths.dist.root + paths.dist.js + '/script*.js', '!' + paths.dist.root + paths.dist.js + '/jquery*.js', '!' + paths.dist.root + paths.dist.js + '/bootstrap*.js', '!' + paths.dist.root + paths.dist.js + '/ui*.js', '!' + paths.dist.root + paths.dist.js + '/*-i.js'], {
      read: false
    }), {
      relative: true,
      removeTags: true,
      transform: function(filepath) {
        return '<script src="' + filepath + '" defer>' + '</script>';
      }
    }))
    .pipe(gulp.dest(paths.dist.root))
});


// Compile SCSS
gulp.task('sass', function() {
  return gulp.src([paths.src.scss, '!' + paths.src.root + paths.dist.scss + '/*-i.scss', '!' + paths.src.root + paths.dist.scss + '/*-bak.scss'])
    // .pipe(sass({
    //   outputStyle: 'expanded'  //For old "gulp-sass"
    // }).on('error', sass.logError))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpautoprefixer()) //Cannot use autoprefixer or get err
    .pipe(replace('@charset "UTF-8";', ''))
    .pipe(gulp.dest(paths.src.root + paths.dist.css))
    .pipe(browserSync.stream())
});

// Minify + Combine CSS
gulp.task('css', function() {
  return gulp.src([paths.src.css, '!' + paths.src.root + paths.dist.css + '/font*.css', '!' + paths.src.root + paths.dist.css + '/tail*.css', '!' + paths.src.root + paths.dist.css + '/ui*.css', '!' + paths.src.root + paths.dist.css + '/boot*.css', '!' + paths.src.root + paths.dist.css + '/jquery*.css'])
    .pipe(mode.development(
      postcss([
        atimport(),
        autoprefixer()
      ])
    ))
    .pipe(mode.production(
      postcss([
        atimport(),
        autoprefixer()
      ])
    ))
    .pipe(mode.production(
      cleanCSS({
        compatibility: 'ie8'
      })
    ))
    .pipe(mode.production(
      rename({
        suffix: '.min'
      })
    ))
    .pipe(mode.purge(
      postcss([
        atimport(),
        purgecss({ // Using '@fullhuman/postcss-purgecss'
          content: [paths.src.html, paths.src.js],
          // 'defaultExtractor' Must be necessary here
          defaultExtractor: content => content.match(/[\w-/:!@]+(?<!:)/g) || []
        }),
        autoprefixer()
      ])
    ))
    .pipe(mode.purge(
      cleanCSS({
        compatibility: 'ie8'
      })
    ))
    .pipe(mode.purge(
      rename({
        suffix: '.min'
      })
    ))
    // .pipe(
    //   postcss([
    //     atimport(),
    //     // purgecss({
    //     //   content: [paths.src.html, paths.src.js],
    //     //   // whitelist: ['opacity-100'],
    //     //   defaultExtractor: content =>
    //     //     content.match(/[\w-/:!@]+(?<!:)/g) || []
    //     // }),
    //     autoprefixer()
    //   ])
    // )
    // .pipe(cleanCSS({
    //   compatibility: 'ie8'
    // }))
    // // .pipe(concat('app.css'))
    // .pipe(rename({
    //   suffix: '.min'
    // }))
    .pipe(gulp.dest(paths.dist.root + paths.dist.css))
});
gulp.task('mincss', function() {
  return gulp.src([paths.src.root + paths.dist.css + '/*.min.css', '!' + paths.src.root + paths.dist.css + '/jquery*.css'])
    .pipe(mode.production(
      postcss([
        atimport(),
        autoprefixer()
      ])
    ))
    .pipe(mode.production(
      cleanCSS({
        compatibility: 'ie8'
      })
    ))
    .pipe(mode.purge(
      postcss([
        atimport(),
        purgecss({
          content: [paths.src.html, paths.src.js],
          // whitelist: ['opacity-100'],
          defaultExtractor: content =>
            content.match(/[\w-/:!@]+(?<!:)/g) || []
        }),
        autoprefixer()
      ])
    ))
    .pipe(mode.purge(
      cleanCSS({
        compatibility: 'ie8'
      })
    ))
    .pipe(gulp.dest(paths.dist.root + paths.dist.css))
});

// Minify + Combine JS
gulp.task('js', function() {
  return gulp.src([paths.src.js, '!' + paths.src.root + paths.dist.js + '/*.min.js', '!' + paths.src.root + paths.dist.js + '/*-i.js', '!' + paths.src.root + paths.dist.js + '/*-bak.js', '!' + paths.src.root + paths.dist.js + '/*-old.js'])
    // .pipe(mode.production(
    //   autopolyfiller('script_polyfill.js', {
    //     browsers: require('autoprefixer').default
    //   })
    // ))
    // .pipe(autopolyfiller('script-polyfill.js'))
    .pipe(mode.production(
      uglify()
    ))
    .pipe(mode.production(
      rename({
        suffix: '.min'
      })
    ))
    .pipe(mode.purge(
      uglify()
    ))
    .pipe(mode.purge(
      rename({
        suffix: '.min'
      })
    ))
    // .pipe(uglify())
    // // .pipe(concat('app.js'))
    // .pipe(rename({
    //   suffix: '.min'
    // }))
    // .pipe(gulp.dest(paths.dist.root + paths.dist.js))
    .pipe(mode.production(gulp.dest(paths.dist.root + paths.dist.js)))
    .pipe(mode.purge(gulp.dest(paths.dist.root + paths.dist.js)))

    .pipe(browserSync.stream());
});

// Compress (JPEG, PNG, GIF, SVG, JPG)
gulp.task('img', function() {
  return gulp.src(paths.src.img)
    .pipe(imageMin([
      imageMin.gifsicle(),
      imageMin.mozjpeg(),
      imageMin.optipng(),
      imageMin.svgo(),
      pngQuint(),
      jpgRecompress()
    ]))
    .pipe(gulp.dest(paths.dist.root + paths.dist.img));
});

// ceate dist dir
gulp.task('dist', function() {
  return gulp.src('*.*', {
      read: false
    })
    .pipe(gulp.dest(paths.dist.root))
});

// clean dist and keep the directory
gulp.task('clean', function() {
  return del(['dist/**', '!dist']);
});

// Watch (SASS, CSS, JS, and HTML) reload browser on change
gulp.task('watch', function() {
  browserSync.init({
    server: {
      baseDir: paths.root.www
    }
  })
  gulp.watch(paths.src.scss, gulp.series('sass')).on('change', browserSync.reload);
  gulp.watch(paths.src.css, gulp.series('css')).on('change', browserSync.reload);
  gulp.watch(paths.src.js).on('change', browserSync.reload);
  // gulp.watch(paths.src.js, gulp.series('js')).on('change', browserSync.reload);
  // gulp.watch(paths.src.templates, gulp.series('templates')).on('change', browserSync.reload);
  gulp.watch(paths.src.root + paths.dist.templates + '/**/*.hbs', gulp.series('delhtml', 'templates')).on('change', browserSync.reload);
  gulp.watch(paths.src.html).on('change', browserSync.reload);
});

//------------------- First run 'gulp start' ---------------------------------------------------------
//First Preset all files
// gulp.task('vendors', gulp.series('tailwind', 'copyjs', 'copycss', 'fontawesome', 'copyfonts'));
// gulp.task('vendors', gulp.series('copyjs', 'copycss', 'fontawesome', 'copyfonts'));
gulp.task('vendors', gulp.series(uk ? ['ukjs', 'ukcss'] : '', bs ? ['bsjs', 'bscss', 'bsfonts'] : '', fa ? ['fontawesome', 'fsfonts'] : '', jq ? 'jqjs' : '', 'othercss'));

//Compile Tailwind to CSS and minify css, using 'gulp tailwind' & 'gulp tailwind --production' to purge css on production
gulp.task('tocss', gulp.series('tailwind', 'sass', 'css', 'mincss'));
// gulp.task('tocss', gulp.series('tailwind', 'sass', 'css'));

//Compile SCSS to CSS and purge & minify css, needed when modify scss
gulp.task('scss', gulp.series('sass', 'css'));

//------------------- Remember edit 'title' in gulp.task('templates') ---------------------------------------------------------
//********** First Edit title: ' ' **************
//Inject path manually in 'meta.hbs' files, no 'inject' task
gulp.task('temp', gulp.series('templates'));
//Inject path to all html files relative to /src and /dist [NO for different injection in html]
gulp.task('html', gulp.series('delhtml', 'templates', 'sass', 'js', 'inject'));

//0. Preset
gulp.task('start', gulp.series('vendors', 'delhtml', 'templates', 'sass', 'js', 'inject'));

//1. Preset then watch
gulp.task('server', gulp.series('vendors', 'tailwind', 'templates', 'sass', 'inject', 'watch'));

//3. Prepare all assets for production, run: 'yarn build-nohtml' or 'yarn build'
gulp.task('build-nohtml', gulp.series('vendors', 'tocss', 'js', 'img'));
gulp.task('build-purge', gulp.series('dist', 'clean', 'vendors', 'delhtml', 'templates', 'js', 'tocss', 'img', 'inject', 'build-inject'));
gulp.task('build', gulp.series('dist', 'clean', 'vendors', 'delhtml', 'templates', 'js', 'tocss', 'img', 'inject', 'build-inject'));

//--- 0.First run: 'gulp start'
//--- 1.For development run: 'gulp server' or 'yarn server'
//--- 2.For production only run: 'yarn build'