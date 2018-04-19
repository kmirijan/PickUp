const express=require("express");
const mongo=require("mongodb").MongoClient;
const bodyParser=require("body-parser");
const data=require("./public/data.js");


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
	var text="You searched for "+req.body["event"]+" and "+req.body["location"];
	const eventExists=data.valEvent(req.body["event"]);
	const locationExists=data.valEvent(req.body["location"]);
	res.send(text);
	console.log(eventExists);
});

/*deploy app*/
const port=process.env.PORT||8000;
app.listen(port,()=>{
    console.log(port);
});

/*connect mongodb*/
/*sudo service mongod stop*/
var url="mongodb://localhost:27017";
var eventDocs=[
	{"name":"soccer"},
	{"name":"tennis"},
	{"name":"pool"},
];
var locationDocs=[
	{"name":"park"},
	{"name":"123 street"},
	{"name":"somewhere"},
];
/*client is used for new version of mongodb*/
mongo.connect(url,(err,client)=>{
	if(err)throw new Error(err);

	var db=client.db("data")
	db.collection("events").insertMany(eventDocs,(err,result)=>{
		if(err)throw new Error(err);
		console.log("inserted document")
	});
	db.collection("locations").insertMany(locationDocs,(err,result)=>{
		if(err)throw new Error(err);
		console.log("inserted document")
	});
	console.log("connected to mongodb");
	client.close();
});





