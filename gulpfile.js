const { src, dest, watch, parallel, series } = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const pugs = require("gulp-pug");
const browserSync = require("browser-sync").create();
const svgSprite = require("gulp-svg-sprite");


function browsersync() {
    browserSync.init({
        server: {
            baseDir: "build"
        }
    });
}

function svgsprite() {
    return src("app/assets/images/icons/*.svg")
        .pipe(svgSprite({
            mode: {
                symbol: {
                    dest: "."
                }
            },
        }
    ))
        .pipe(dest("app/assets/images/sprite"))
}

function copyImg () {
    return src("app/assets/**")
    .pipe(dest("build/assets"))
}

function styles() {
    return src("app/sass/app.scss")
        .pipe(scss())
        .pipe(dest("build/style"))
        .pipe(browserSync.stream())
}

function pug() {
    return src("app/pug/*.pug")
    .pipe(pugs({
        pretty: true
    }))
    .pipe(dest("build"))
    .pipe(browserSync.stream())
}

function watcher() {
    watch(["app/sass/**/*.scss"], styles);
    watch(["app/pug/**/*.pug"], pug);
}

exports.styles = styles;
exports.pug = pug;
exports.watcher = watcher;
exports.browsersync = browsersync;
exports.svgsprite = svgsprite;
exports.copyImg = copyImg;

exports.default = series(
    parallel(pug, styles),
    parallel(watcher, browsersync)
);