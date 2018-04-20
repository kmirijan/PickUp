const express=require("express");
const mongo=require("mongodb").MongoClient;
const bodyParser=require("body-parser");
const data=require("./public/data.js");
var mime = require('mime-types')

const app=express();
/*configurations*/
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/main.html");
});
app.post("/search",(req,res)=>{
	data.valEL(res,req.body["event"],req.body["location"]);
});

/*deploy app*/
const port=process.env.PORT||8000;
app.listen(port,()=>{
    console.log(port);
});



