const mongo=require("mongodb").MongoClient;
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
	//insert collection

	db.collection("events").insertMany(eventDocs,(err,result)=>{
		if(err)throw new Error(err);
		console.log("inserted document");
	});
	db.collection("locations").insertMany(locationDocs,(err,result)=>{
		if(err)throw new Error(err);
		console.log("inserted document");
	});


	//delete database from console
	/*
	use events
	db.events.drop();
	db.locations.drop();
	*/

	console.log("connected to mongodb");
	client.close();
});
