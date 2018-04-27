const mongo=require("mongodb").MongoClient;
/*connect mongodb*/
/*sudo service mongod stop*/
var url="mongodb://localhost:27017";
var users=[
	{
		"username":"user1234",
		"alias":"USER 1234",
		"email":"user1234@email.com",
		"pic":"https://images.yswcdn.com/546017470459747400-ql-85/200/200/ay/blaircandy/basketball-candy-42.jpg",
		"bio":`user1234user1234user1234
			user1234user1234user1234
			user1234user1234user1234
			user1234user1234user1234
			user1234user1234user1234
			user1234user1234user1234
			user1234user1234user1234
			user1234user1234user1234
			user1234user1234user1234
			user1234user1234user1234
			user1234user1234user1234
			user1234user1234user1234
			user1234user1234user1234`,
		"games":[
			{"game":"basketball"},
			{"game":"basketball"},
			{"game":"basketball"}
		]

	},
	{	
		"username":"helloworld",
		"alias":"HELLO WORLD",
		"email":"helloworld@email.com",
		"pic":"http://rs672.pbsrc.com/albums/vv88/zykesmith/soccer-ball.jpg~c200",
		"bio":`helloworldhelloworldhelloworld
			helloworldhelloworldhelloworld
			helloworldhelloworldhelloworld
			helloworldhelloworldhelloworld
			helloworldhelloworldhelloworld
			helloworldhelloworldhelloworld
			helloworldhelloworldhelloworld
			helloworldhelloworldhelloworld
			helloworldhelloworldhelloworld
			helloworldhelloworldhelloworld
			helloworldhelloworldhelloworld
			helloworldhelloworldhelloworld
			helloworldhelloworldhelloworld`,
		"games":[
			{"game":"basketball"},
			{"game":"basketball"},
			{"game":"basketball"},
			{"game":"basketball"},
			{"game":"basketball"},
			{"game":"basketball"}
		]
	},
];

/*client is used for new version of mongodb*/

mongo.connect(url,(err,client)=>{
	if(err)throw new Error(err);

	var db=client.db("data")
	//insert collection
	
	
	db.collection("users").insertMany(users,(err,result)=>{
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