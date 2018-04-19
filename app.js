var MongoClient = require('mongodb').MongoClient, 
	assert = require('assert'),
	http = require('http')
	fs = require('fs');

var url = 'mongodb://localhost:27017/games';

http.createServer(function (req, res){
	fs.readFile('home.html', function(err, data) {
		res.write(data)
		res.end();
	});
}).listen(8080);

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


