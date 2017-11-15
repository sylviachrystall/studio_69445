const gulp         = require('gulp'),
      del          = require('del'),
      merge        = require('gulp-merge'),
      bump         = require('gulp-bump'),
      plumber      = require('gulp-plumber'),
      inject       = require('gulp-inject'),
      nunjucks     = require('gulp-nunjucks'),
      htmlMinifier = require('gulp-htmlmin'),
      rename       = require('gulp-rename'),
      sourcemaps   = require('gulp-sourcemaps'),
      babelify     = require('babelify'),
      browserify   = require('browserify'),
      uglify       = require('gulp-uglify'),
      source       = require('vinyl-source-stream'),
      buffer       = require('vinyl-buffer'),
      sass         = require('gulp-sass'),
      cleanCss     = require('gulp-clean-css'),
      sequence     = require('gulp-sequence'),
      p            = require('path');


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
        root    : norm(`${root}`),
        package : norm(`${root}/package.json`),
        build   : norm(`${root}/build`),
        dist    : norm(`${root}/dist`),
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
    'build.main',
    () => {
        const markup = gulp
            .src(path('markup') + '/markup.nunj')
            .pipe(plumber())
            .pipe(nunjucks.compile({ data : data }))
            .pipe(htmlMinifier({ collapseWhitespace: true } ));

        const styles = gulp
            .src(path('styles') + '/main.sass')
            .pipe(plumber())
            .pipe(sass.sync().on('error', sass.logError))
            .pipe(cleanCss({ compatibility: 'ie8' }));

        // Build scripts
        return browserify({
                debug: true,
                entries: [
                    path('scripts') + '/main.js',
                ],
            })
            .transform(babelify.configure({ presets : ["es2015"] }))
            .bundle()
            .on('error',
                function(err) {
                    console.error(err);
                    this.emit('end');
                }
            )
            .pipe(plumber())
            .pipe(source('main.js'))
            .pipe(buffer())
            // .pipe(sourcemaps.init({ loadMaps: true }))
            // inject markup
            .pipe(inject(
                markup,
                {
                    starttag   : '<<<< inject-markup',
                    endtag     : 'markup-end >>>>',
                    removeTags : true,
                    transform  : function (filepath, file) {
                        return file.contents.toString('utf8');
                    }
                }
            ))
            // inject styles
            .pipe(inject(
                styles,
                {
                    starttag   : '<<<< inject-styles',
                    endtag     : 'styles-end >>>>',
                    removeTags : true,
                    transform  : function (filepath, file) {
                        return file.contents.toString('utf8');
                    }
                }
            ))
            .pipe(uglify())
            // .pipe(sourcemaps.write())
            .pipe(gulp.dest(path('build')));
    }
);


gulp.task(
    'build',
    (cb) => {
        sequence(
            'build.copy',
            'build.main'
        )(cb);
    }
);


gulp.task(
    'dist.build',
    () => {
        const pkg     = require(path('package')),
              version = pkg.version,
              suffix  = version.replace(/\./g, '_');

        return gulp
            .src(path('build') + '/main.js')
            .pipe(uglify())
            .pipe(rename({ suffix : `_${suffix}` }))
            .pipe(gulp.dest(path('dist')));
    }
);


gulp.task(
    'dist',
    (cb) => {
        sequence(
            'build',
            'dist.build'
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


gulp.task(
    'bump-major',
    () => {
        return gulp
            .src(path('package'))
            .pipe(bump({ type: 'major' }))
            .pipe(gulp.dest(path('root')));
    }
);


gulp.task(
    'bump-minor',
    () => {
        return gulp
            .src(path('package'))
            .pipe(bump({ type: 'minor' }))
            .pipe(gulp.dest(path('root')));
    }
);


gulp.task(
    'bump-patch',
    () => {
        return gulp
            .src(path('package'))
            .pipe(bump({ type: 'patch' }))
            .pipe(gulp.dest(path('root')));
    }
);
