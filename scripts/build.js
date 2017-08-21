var browserify = require('browserify');
var tsify = require('tsify');
var file = require('fs');
var path = require('path');



var outpath = path.join(__dirname, '..', '/charty.js');

var bundlefs = file.createWriteStream(outpath);

browserify()
    .add('src/main.ts')
    .plugin(tsify, { noImplicitAny: true })
    .bundle()
    .on('error', function (error) { console.error(error.toString()); })
    .pipe(bundlefs);