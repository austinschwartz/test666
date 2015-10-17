var http = require('http')
  , util = require('util')
  , mu   = require('mu2')
  , fs   = require('fs')
  , shortid = require('shortid')
  , child_process = require('child_process');

mu.root = __dirname + '/templates'

var userInfo = JSON.parse(fs.readFileSync('testdata.json', 'utf8'));
var targetFile = 't1.out.tex';

var writer = fs.createWriteStream(targetFile);
var texFile = mu.compileAndRender('t1.tex', userInfo);
texFile.pipe(writer, { end: false });
texFile.on('end', function() {
  child_process.exec('pdflatex -output-directory output -interaction=nonstopmode ' + targetFile);
});


