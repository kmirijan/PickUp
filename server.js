const express=require("express");
const mongo=require("mongodb").MongoClient;
const bodyParser=require("body-parser");
const data=require("./src/server/data.js");
var mime = require('mime-types');
const mkprofile=require("./src/server/mkprofile.js");

const app=express();
/*configurations*/
app.use(express.static("./dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

/*sends index.html to any link*/
app.get("*",(req,res)=>{
    res.sendFile(__dirname+"/dist/index.html");
});
app.post("/search",(req,res)=>{
	data.valEL(res,req.body["event"],req.body["location"]);
});
app.post("/user",(req,res)=>{
	mkprofile.getUsers(req.body.params.name,res);
});
app.post("/saveprofile",(req,res)=>{
	mkprofile.saveProfile(req.body,res);
});
app.post("/signup",(req,res)=>{
	mkprofile.signUp(req.body,res);
});
app.post("/signin",(req,res)=>{
	mkprofile.signIn(req.body,res);
})

/*----------------------------------------------------------------------------------------*/
const makeValid = (obj) => {return obj != null ? obj : "";};
var mongoUrl = 'mongodb://pickup:cs115@ds251819.mlab.com:51819/pickup';

app.post("/postgames", (req, res) =>
{
  console.log('[', (new Date()).toLocaleTimeString(), "] Game received");
  
  console.log(req.body);

  var game = {
    sport: makeValid(req.body.sport),
    name: makeValid(req.body.name),
    location: makeValid(req.body.location),
    id: makeValid(req.body.gameId),
    owner: makeValid(req.body.user),
    players: [makeValid(req.body.user),],
  };
  
  mongo.connect(mongoUrl, (err, db) => {
    if (err) throw err;

    db.db("pickup").collection("games").insertOne(game,() => {db.close()});
  
  });
});

app.post("/games", (req, res) =>
{
  console.log('[', (new Date()).toLocaleTimeString(), "] Games sending");

  var search = req.body.filter;

  mongo.connect(mongoUrl, (err, db) => {
    if (err) throw err;
    db.db("pickup").collection("games").find({}).toArray((err, result) => {
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




