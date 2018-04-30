const express=require("express");
const mongo=require("mongodb").MongoClient;
const bodyParser=require("body-parser");
const data=require("./src/components/data.js");
var mime = require('mime-types');


var mongoUrl = 'mongodb://pickup:cs115@ds251819.mlab.com:51819/pickup';

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


app.post("/games", (req, res)
{
  console.log('[', (new Date()).toLocaleTimeString(), "] Game received");
  var game = {
    activity: req.body.game.sport,
    name: req.body.game.name,
    loc: req.body.game.location,
    id: req.body.game.id
  };
  
  mongo.connect(mongoUrl, (err, db) => {
    if (err) throw err;

    db.collection("games").insertOne(game,() => {db.close()});
  
  });
});

app.get("/games", (req, res)
{
  console.log('[', (new Date()).toLocaleTimeString(), "] Games sending");

  var search = req.body.filter;

  mongo.connect(mongoUrl, (err, db) => {
    if (err) throw err;
    db.collection("games").find().toArray((err, result) => {
      if (err) throw err;
      res.json(result);
      res.end();
      db.close();


    });

  
  });

});


/*deploy app*/
const port=process.env.PORT||8000;
app.listen(port,()=>{
    console.log(port);
});




