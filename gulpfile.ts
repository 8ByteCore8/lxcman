import gulp from "gulp";
import { rm } from "fs/promises";
import ts from "gulp-typescript";
import merge = require("merge2");
import map from "gulp-sourcemaps";
import uglify from "gulp-uglify";
import { exec } from "child_process";


gulp.task("build:clean", () => {
    return rm("./dist", { recursive: true, force: true });
});

gulp.task("build:code", (() => {
    const project = ts.createProject('tsconfig.json', {
        declaration: true,
    });

    let res = gulp.src("./src/**/*")
        .pipe(map.init())
        .pipe(project());

    return merge(
        res.dts
            .pipe(gulp.dest("./dist/types")),
        res.js
            .pipe(uglify({ compress: true }))
            .pipe(map.write())
            .pipe(gulp.dest("./dist"))
    );
}));

gulp.task("build:copy", gulp.parallel([
    () => {
        return gulp.src("./package.json")
            .pipe(gulp.dest("./dist/"));
    },
    () => {
        return gulp.src("./README.md")
            .pipe(gulp.dest("./dist/"));
    }
]));

gulp.task("build:pack", gulp.series(
    () => {
        return new Promise<void>((res, rej) => {
            exec("cd ./dist/; yarn pack", (err) => {
                if (!err)
                    res();
                else
                    throw err;

            });
        });
    },
    () => {
        return gulp.src("./dist/*.tgz")
            .pipe(gulp.dest("./"));
    },
    "build:clean",
));

gulp.task("build",
    gulp.series([
        "build:clean",
        "build:code",
        "build:copy",
        "build:pack",
    ]));

