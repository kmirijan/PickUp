const mongo=require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const express=require("express");
const fs=require("fs");
const cheerio=require("cheerio");
const url="mongodb://pickup:cs115@ds251819.mlab.com:51819/pickup";
const mongoose=require("mongoose");
//mongoose.connect("mongodb://localhost:27017");

exports.isGame=(id,res)=>{
	mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);
		var db=client.db("pickup");
		db.collection("games").count({"id":Number(id)}).then((count)=>{
			if(count<1){
				res.json(false);
			}
			else{
				res.json(true);
			}
			client.close();
		})
	})
}
exports.isGameT=(id,res)=>{
	mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);
		var db=client.db("pickup");
		console.log(id);
		db.collection("teamgames").count({"id":Number(id)}).then((count)=>{
			if(count<1){
				res.json(false);
			}
			else{
				res.json(true);
			}
			client.close();
		})
	})
}
