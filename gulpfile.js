const gulp = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const csso = require('gulp-csso')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')
const pump = require('pump')
const autoprefixer = require('gulp-autoprefixer')


gulp.task('js', cb => {
    return pump([
        gulp.src('./dev/js/**/*.js'),
        sourcemaps.init(),
        concat('dpm-dom.js'),
        gulp.dest('./public/js'),
        babel({presets: 'babel-preset-env'}),
        uglify(),
        rename({suffix:'.min'}),
        sourcemaps.write('.'),
        gulp.dest('./public/js')
    ], cb)
})

gulp.task('sass', cb => {
    return pump([
        gulp.src('./dev/sass/main.scss'),
        sourcemaps.init(),
        autoprefixer({browsers: 'last 3 versions'}),
        sass(),
        // rename({basename:"styles"}),
        gulp.dest('./public/css'),
        csso(),
        rename({suffix:'.min'}),
        sourcemaps.write('.'),
        gulp.dest('./public/css')
    ], cb)
})

gulp.task('watch', () => {
    gulp.watch('./dev/js/**/*.js', gulp.parallel('js') )
    gulp.watch('./dev/sass/**/*.scss', gulp.parallel('sass') )
})
gulp.task( 'default', gulp.parallel('js', 'sass', 'watch') )