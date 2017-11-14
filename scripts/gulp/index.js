const gulp       = require('gulp'),
      del        = require('del'),
      merge      = require('gulp-merge'),
      nunjucks   = require('gulp-nunjucks'),
      rename     = require('gulp-rename'),
      sourcemaps = require('gulp-sourcemaps'),
      babelify   = require('babelify'),
      browserify = require('browserify'),
      source     = require('vinyl-source-stream'),
      buffer     = require('vinyl-buffer'),
      sass       = require('gulp-sass'),
      sequence   = require('gulp-sequence'),
      p          = require('path');


/**
 * Function to handle dot-access.
 *
 * @param {*}      obj
 * @param {string} prop
 * @param {*}      [defaultVal=null]
 *
 * @returns {*}
 */
function get(obj, prop, defaultVal = null)
{
    let value = defaultVal;

    if (obj !== null && typeof obj === 'object') {
        if (typeof prop === 'string' && prop.length > 0) {
            const parts = prop.split('.');

            value = obj;

            for (let i = 0, len = parts.length; i < len; i++) {
                const part = parts[i];

                if (value !== null && typeof value === 'object') {
                    if (part in value) {
                        value = value[part];
                    } else {
                        return defaultVal;
                    }
                } else {
                    return defaultVal;
                }
            }
        }
    }

    return value;
}


/**
 * Function to handle paths
 *
 * @param {string} property
 *
 * @returns {string|null}
 */
function path(property)
{
    const norm = (path) => p.normalize(path),
          root = norm(__dirname + '/../../');

    const paths = {
        build   : norm(`${root}/build`),
        src     : norm(`${root}/src`),
        data    : norm(`${root}/src/data`),
        markup  : norm(`${root}/src/markup`),
        scripts : norm(`${root}/src/scripts`),
        styles  : norm(`${root}/src/styles`),
    };

    return get(paths, property);
}


/**
 * Function to handle data
 *
 * @param {string} property
 *
 * @returns {string|null}
 */
function data(property)
{
    const dir = path('data');

    return null;
}


gulp.task(
    'default',
    () => {
        return gulp;
    }
);


gulp.task(
    'clear',
    () => {
        return del(
            [
                path('build') + '/**/*.*',
            ],
            {
                force : true,
            }
        );
    }
);


gulp.task(
    'build.copy',
    () => {
        // Copy index.html
        return gulp
            .src(path('markup') + '/index.html')
            .pipe(gulp.dest(path('build')));
    }
);


gulp.task(
    'build.markup',
    () => {
        // Build markup
        return gulp
            .src(path('markup') + '/markup.nunj')
            .pipe(nunjucks.compile({ data : data }))
            .pipe(rename({ basename: 'main', extname : '.html' }))
            .pipe(gulp.dest(path('build')));
    }
);


gulp.task(
    'build.scripts',
    () => {
        // Build scripts
        return browserify({
                debug: true,
                entries: [
                    path('scripts') + '/main.js',
                ],
            })
            .transform(babelify.configure({ presets : ["es2015"] }))
            .bundle()
            .pipe(source('main.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(path('build')));
    }
);


gulp.task(
    'build.styles',
    () => {
        // Build styles
        return gulp
            .src(path('styles') + '/main.sass')
            .pipe(sourcemaps.init())
            .pipe(sass.sync().on('error', sass.logError))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(path('build')));
    }
);


gulp.task(
    'build',
    (cb) => {
        sequence(
            'build.copy',
            'build.markup',
            'build.scripts',
            'build.styles'
        )(cb);
    }
);


gulp.task(
    'make',
    (cb) => {
        sequence(
            'clear',
            'build'
        )(cb);
    }
);


gulp.task(
    'watch',
    [
        'make'
    ],
    () => {
        return gulp.watch(
            path('src') + '/**/*.*',
            [
                'make',
            ]
        );
    }
);
