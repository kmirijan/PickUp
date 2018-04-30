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



/*deploy app*/
const port=process.env.PORT||8000;
app.listen(port,()=>{
    console.log(port);
});




