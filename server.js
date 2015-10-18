var express = require('express')
var bodyParser = require("body-parser");
var http = require('http')
  , util = require('util')
  , mu   = require('mu2')
  , fs   = require('fs')
  , path = require('path')
  , shortid = require ('shortid')
  , child_process = require('child_process');

var app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mu.root = __dirname + '/templates'

app.post('/post', function(req, res) {
  var url = req.protocol + '://' + req.get('host');
  var postFile = shortid.generate();
  var userInfo, json, template;
  if (req.headers['content-type'] != 'application/json')
    json = JSON.parse(Object.keys(req.body)[0]);
  else
    json = req.body;

  userInfo = json.userInfo;
  template = json.template;
  console.log('building ' + template + " -> " + postFile + ".tex");
    
  var texFile = mu.compileAndRender(template, userInfo);
  var writer = fs.createWriteStream('./temp/' + postFile + '.tex');
  texFile.pipe(writer, { end: false });
  texFile.on('end', function() {
    child_process.exec('TEXINPUTS="./templates:" pdflatex -output-directory pdf -interaction=nonstopmode ./temp/' + postFile + '.tex').on('exit', function() {
      res.send(url + '/pdf/' + postFile + '.pdf');
      //res.download(path.resolve('./pdf/' + postFile + '.pdf'));
      //res.redirect('/pdf/' + postFile + '.pdf');
    });
  });

});

app.use('/pdf', express.static('./pdf'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


app.listen(3000);
