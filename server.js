const express = require('express');
var bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
var {GameInfo} = require('./db/gameInfo');


const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api', (req, res) => {
	var gI = new GameInfo({
		game: req.body.game,
		location: req.body.location,
		user: req.body.user
	});

	gI.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send();
	});
});

app.get('/api', (req, res) => {
	GameInfo.find().then((gIs) => {
		res.send({gIs});
	}, (e) => {
		res.staus(400).send();
	});

});

app.get('/', (req, res) => {
	res.sendFile(__dirname+"/public/main.html");
});

app.listen(port, () => {
	console.log(`Server is up: ${port}`);
});

module.exports = {app};
