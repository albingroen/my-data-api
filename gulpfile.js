const gulp = require("gulp");
const nodemon = require("gulp-nodemon");
const eslint = require("gulp-eslint");

const SOURCES = ["app/**/*.js", "wengine/**/*.js"];

// const SOURCES = [
//   '**/*.js',
//   '!node_modules/**'
// ];

const SCRIPT = "server.js";

gulp.task("lint", () =>
	gulp
		.src(SOURCES)
		.pipe(
			eslint({
				fix: true,
			})
		)
		.pipe(eslint.format())
);

gulp.task("nodemon", () => {
	nodemon({
		script: SCRIPT,
		ext: "js",
		quiet: true,
	}).on("start", () => {
		gulp.start("lint");
		console.log(`\x1B[33m[nodemon] Starting \`${SCRIPT}\` \x1B[37m`);
	});
});

gulp.task("default", ["lint", "nodemon"]);
