var files = [];

let gulp            =   require('gulp'),
    sourcemaps      =   require('gulp-sourcemaps'),
    sass            =   require('gulp-sass'),
    autoprefixer    =   require('gulp-autoprefixer'),
    rename          =   require('gulp-rename'),
    uglify          =   require('gulp-uglify'),
    cssmin          =   require('gulp-cssmin'),
    browserSync     =   require('browser-sync'),
    concat          =   require('gulp-concat'),
    strip           =   require('gulp-strip-comments'),
    del             =   require('del'),
    fs              =   require('fs');

//Browser-sync
gulp.task('browser-sync:init', (done) => {
    browserSync.init({
        server: {
            baseDir: './src/'
        },
        notify: false
    });
    done();
});

gulp.task('browser-sync:reload', (done) => {
    browserSync.reload();
    done();
});

gulp.task('browser-sync:stream', (done) => {
    browserSync.reload({stream:true});
    done();
});

//Scripts building
gulp.task('scripts:update-list', (done) => {
    let fileContent = fs.readFileSync('src/js/fileList.json');
    let fileJson = JSON.parse(fileContent);

    files = [];
    fileJson.files.forEach((value) => files.push('src/' + value));

    done();
});

gulp.task('scripts', () => {
    return gulp.src(files)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('src/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(strip())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/js'));
});


//Styles building
gulp.task('styles', () => {
    return gulp.src('src/sass/**/*.sass')
        .pipe(sass({outputStyle: 'expanded'})).on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 15 versions'],
            cascade: true
        }))
        .pipe(gulp.dest('src/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(strip.text())
        .pipe(sourcemaps.init())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css'));
});


//File watchers
gulp.task('watch:pre', gulp.series('browser-sync:init', 'scripts:update-list', 'styles', 'scripts'));

gulp.task('watch:init', () => {
    gulp.watch('src/sass/**/*.sass', gulp.series('styles', 'browser-sync:stream'));
    gulp.watch('src/js/common.js', gulp.series('scripts', 'browser-sync:reload'));
    gulp.watch('src/*.html', gulp.series('browser-sync:reload'));
    gulp.watch('src/img/**/*', gulp.series('browser-sync:reload'));
    gulp.watch('src/js/fileList.json', gulp.series('scripts:update-list', 'scripts', 'browser-sync:reload'));
});

gulp.task('watch', gulp.series('watch:pre', 'watch:init'));



//Build tasks

gulp.task('build:pre', gulp.series('scripts:update-list', 'styles', 'scripts'));

gulp.task('build:clean', (done) => {
    del(['dist/'], {force: true});
    done();
});

gulp.task('build:copy', (done) => {
    gulp.src('src/css/main.min.css')
        .pipe(gulp.dest('dist/css'));

    gulp.src('src/js/scripts.min.js')
        .pipe(gulp.dest('dist/js'));

    gulp.src('src/*.html')
        .pipe(strip())
        .pipe(gulp.dest('dist/'));

    gulp.src('src/img/*.*')
        .pipe(gulp.dest('dist/img'));

    done();
});

gulp.task('build', gulp.series('build:clean', 'build:pre', 'build:copy'));

//Setting the gulp default task to watch task

gulp.task('default', gulp.series('watch'));