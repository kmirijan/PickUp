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

exp.use(bodyParser.json());

exp.get('/games', function(req, res) {
	MongoClient.connect(url, function (err, db) {
		if (err) throw err;
		// find all games
		// return games
		//req.body.
		db.collection("games").find({}).then(function (result)
			{
				res.json(result);
				res.end();
				db.close();
			}
		);
		
	});
});

exp.post('/games', function(req, res) {
	console.log("POST received");
	console.log("body:", req.body);
	var game = {name: req.body.name, 
		activity: req.body.activity,
		loc: req.body.loc
	};

	MongoClient.connect(url, function (err, db)
		{
			if (err) throw err;
			
			game = 
			{ 
				name: req.body.name,
				loc: req.body.loc,
				activity: req.body.activity
			};
			db.collection("games").insertOne(game, () => {console.log("obj written: ", game);db.close()});

		}
	);
});

// trying to run server purely through express app
exp.get('/', function (req, res){
	fs.readFile('build/index.html', function(err, mainPage) {
			console.log('[', (new Date()).toLocaleTimeString(), ']: Page written');	
			res.write(mainPage);
			res.end();

		});
	//});
});

exp.get('/games.build.js', function (req, res)
	{
		fs.readFile('build/games.build.js', function (err, script)
			{	
				console.log('[', (new Date()).toLocaleTimeString(), ']: games.build.js written');	
				res.write(script);
				res.end();
			}
		);
	}
);


exp.listen(process.env.PORT || 8080);


console.log('[', (new Date()).toLocaleTimeString(), ']: Server Opened');

// create a server using the http module
/*
http.createServer(function (req, res){
	fs.readFile('home.html', function(err, mainPage) {
		fs.readFile('build/games.build.js', function(err, reactScript){
		
			res.write(mainPage);
			res.write('<script>');
			res.write(reactScript);
			res.write('</script>')
			res.end();

		});
	});
}).listen(process.env.PORT || 8080);
*/

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

