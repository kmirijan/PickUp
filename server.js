<<<<<<< HEAD
const express=require("express");
const mongo=require("mongodb").MongoClient;
const bodyParser=require("body-parser");
const data=require("./src/components/data.js");
var mime = require('mime-types');

const app=express();
/*configurations*/
app.use(express.static("./dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/dist/main.html");
});
app.post("/search",(req,res)=>{
	data.valEL(res,req.body["event"],req.body["location"]);
});

/*deploy app*/
const port=process.env.PORT||8000;
app.listen(port,()=>{
    console.log(port);
});




=======
const express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {GameInfo} = require('./db/gameInfo');

const port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());

app.post('/', (req, res) => {
	var gI = new GameInfo({
		game: req.body.game,
		location: req.body.location
	});

	gI.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send();
	});
});

app.get('/', (req, res) => {
	GameInfo.find().then((gIs) => {
		res.send({gIs});
	}, (e) => {
		res.staus(400).send();
	});

});

app.listen(port, () => {
	console.log(`Server is up: ${port}`);
});

module.exports = {app};
>>>>>>> e5a2011e4a5dd7e95a2428b867e82b4b820b252d
