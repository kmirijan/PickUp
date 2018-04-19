var MongoClient = require('mongodb').MongoClient, 
	assert = require('assert'),
	app = require('express')
	fs = require('fs');

var url = 'mongodb://pickup:cs115@ds251819.mlab.com:51819/pickup';


app.get('/', function(req, res) {
	MongoClient.connect(url, function (err, db) {
		assert.equal(null, err);

		// find all games
		// return games
	});
})

app.post('/', function(req, res) {
	var game = {name: req.body.name, 
		activity: req.body.activity,
		loc: req.body.loc;
	};

	res.json(game);
});

app.listen(3000);


// create a server using the http module

http.createServer(function (req, res){
	fs.readFile('home.html', function(err, data) {
		res.write(data)
		res.end();
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

