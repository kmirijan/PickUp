const mongo=require("mongodb").MongoClient;
const express=require("express");
const fs=require("fs");
const cheerio=require("cheerio");
const url="mongodb://localhost:27017";
const mongoose=require("mongoose");
//mongoose.connect("mongodb://localhost:27017");

exports.getUsers=(user,res)=>{
	var myUsers ={};
	var tf=mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var db=client.db("data");
		db.collection("users").find({"username":user}).toArray()
		.then((arr)=>{
			res.json(arr);
			client.close();
		});
	});
}

exports.saveProfile=(data,res)=>{
	var tf=mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var db=client.db("data");
		db.collection("users").updateMany({"username":data["username"]},{
			$set:{
				"alias":data["alias"],
				"bio":data["bio"]
			}
		})
		.then(()=>{
			res.json();
			client.close();
		});
	});
}






