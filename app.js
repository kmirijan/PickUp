var MongoClient = require('mongodb').MongoClient, 
	assert = require('assert');

var url = 'mongodb://localhost:27017/games';

MongoClient.connect(url,function (err,db) {
	assert.equal(null, err);
	console.log("Connected successfully to server");
	
	var game = {name: "Person", activity: "soccer", loc: "DVC", timeout: 0};
	db.collection("all").insertOne(game);

	db.close();
});


