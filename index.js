var express = require('express');

var app = express();
var port = 3000;

var mongodb = require("mongodb").MongoClient;
var format = require("util").format;

app.get('/search/:keyword', function(req, res){
	res.status(200);
	res.set('Content-Type', 'application/json');

	mongodb.connect("mongodb://127.0.0.1:27017/getrti", function(err, db){
		if(err){
			throw err;
		}

		var collection = db.collection('pio');
		var keyword = req.params.keyword.replace("+", " "); 
		collection.find({ 
			$text: { 
				$search: keyword
			} 
		}, { 
			score: { 
				$meta: "textScore" 
			} 
		}).sort( { score: { $meta: "textScore" } } ).toArray(function(err, results){
			res.send(results);
		});
	});
});

app.get('/hello', function(req, res){
	res.status(200);
	res.set('Content-Type', 'text/html');

	res.send("<h1>Hello, World!</h1>");
});

app.listen(port, function(){
	console.log("Server running in port %s", port);
});