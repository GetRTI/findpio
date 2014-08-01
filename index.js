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
		collection.aggregate([
		{
       		$match : {
            	$text : {
                       $search : keyword
               	}
       		}
		}, 
		{
       		$project : {
            	name : 1,
               	_id : 0,
               	address : 1,
               	city : 1,
               	country : 1,
               	department : 1,
               	designation : 1,
               	email : 1,
               	fax : 1,
               	phone : 1,
               	state : 1,
               	url : 1,
               	score : {
                       $meta : "textScore"
               	}
       		}
		}, 
		{
       		$match : {
            	score : {
                       $gt : 1.0
               	}
       		}
		}], 
		function(err, results){
			if(err){
				throw err;
			}
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