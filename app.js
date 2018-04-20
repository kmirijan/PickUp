var MongoClient = require('mongodb').MongoClient, 
	assert = require('assert'),
	express = require('express')
	fs = require('fs')
	parseurl = require('parseurl')
	bodyParser = require('body-parser')
	path = require('path'),
	http = require('http'),
	exp = express();


var url = 'mongodb://pickup:cs115@ds251819.mlab.com:51819/pickup';


exp.get('/', function(req, res) {
	MongoClient.connect(url, function (err, db) {
		assert.equal(null, err);

		// find all games
		// return games


		db.close();
	});
});

exp.post('/', function(req, res) {
	var game = {name: req.body.name, 
		activity: req.body.activity,
		loc: req.body.loc
	};

	res.json(game);
});

exp.listen(3000);


// create a server using the http module

http.createServer(function (req, res){
	fs.readFile('home.html', function(err, mainPage) {
		fs.readFile('games.js', function(err, reactScript){
		
			res.write(mainPage);
			res.write('<script>');
			res.write(reactScript);
			res.write('</script>')
			res.end();

		});
	});
}).listen(8080);


// connects to the database, adds an object, and then prints the objects
/*
MongoClient.connect(url,function (err,db) {
	assert.equal(null, err);
	console.log("Connected successfully to server");
	
	var game = {name: "Person", activity: "soccer", loc: "DVC", timeout: 0};
	db.collection("all").insertOne(game);
	db.collection("all").find({loc:"DVC"}).toArray(function(err, result){
		assert.equal(null, err);
		console.log(result);
	});


	db.close();
});
*/

