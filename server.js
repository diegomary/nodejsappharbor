//#!/bin/env node

var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
//var stringify = require('json-stringify');
// The following line is used to serve javascript content in the page that is sent with sendfile. without it
// the javascript inside it is not rendered. if there is a public subdir to serve static content it must be added as follows: app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname)); // in this case genericfile.html resides in the root and its static content is served without adding anything

//The 'body-parser' module only handles JSON and urlencoded form submissions, not multipart(which would be the case if you 're uploading files).
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// to handle file upload we use multer that allows to handle file upload
var multer = require('multer');
app.use(multer({
    dest: './uploads/',
    limits: { fileSize : 1024 * 1024* 10 },// 10 mbytes maximum
    rename: function (fieldname, originalname) {
        //Whatever the function returns will become the new name of the uploaded file 
        return originalname + Date.now();
    },
    onFileUploadStart: function (file) {
        if (file.extension == 'exe')
            return false;
        else return true;
    },
    onFileUploadComplete: function (file) {
        // if the file exceeds the limit the file.truncated variable is set to true else is set to false
        var restruncation = file.truncated;
        if (restruncation) {
            console.log(file.fieldname + ' not uploaded because too big ' + file.path);
            // in this case we get rid of the file so that we can check if it exist in the /upload routing function. good
            fs.unlinkSync(file.path);
        }
        else console.log(file.fieldname + ' uploaded to  ' + file.path);
    }
}));

// Basic Routing   example of get request       use the following querystring:      ?name=John&age=30  done
app.get('/', function (request, response) {
    var name = request.query['name'];
    var age = request.query['age'];
    response.send("You have requested name and age as " + name + '  ' + age);
});


app.get('/test', function (request, response) {
    
    response.send("Test for appharbor");
});
app.get('/filelist', function (request, response) {
    fs.readdir('./uploads/', function (err, files) {
        var total = '<ul>';
        files.forEach(function (value, index, arr) {
            total += ('<li style="list-style-type: none;" ><a href="./uploads/' + value + '">' + value + '</a></li>');
        });
        total += '</ul>';
        response.send(total);
    });
});

app.get('/listwithangular', function (request, response) {
    fs.readdir('./uploads/', function (err, files) {
        response.send(JSON.stringify(files));
    });
});

app.get('/filelistangular', function (request, response) { response.sendFile(path.resolve('angularfilelist.html')); });
// here as contentype use the following:      Content-Type: application/x-www-form-urlencoded
app.post('/', function (request, response) {
    response.send('Username: ' + request.body.username);
});

// here as contentype use the following:     Content-Type: application/json; charset=utf-8
app.post('/jsonpost', function (request, response) {
    var temp = request.body;
    response.send(request.body);
});

app.post('/upload', function (request, response) {
    var originalName = request.files.userfile.originalname; // here userfile is the name of the input file client side
    var path = request.files.userfile.path;
    fs.exists(path, function (exists) {
        if (exists) response.send("The file " + originalName + " has been uploaded successfuly");
        else response.send("The file " + originalName + " is too big and it has been discharged");
    });
});


app.get('/genericfile', function (request, response) { response.sendFile(path.resolve('genericfile.html')); });

app.get('/rosefile', function (request, response) { response.sendFile(path.resolve('images/rose.png')); });



app.get('/upload', function (request, response) { response.sendFile(path.resolve('upload.html')); });

var server = app.listen(process.env.port || 1337, function () {
    console.log('Listening on port %d', server.address().port);
}
);