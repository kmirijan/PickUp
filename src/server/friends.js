const mongo=require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const express=require("express");
const fs=require("fs");
const cheerio=require("cheerio");
const url="mongodb://pickup:cs115@ds251819.mlab.com:51819/pickup";
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
//mongoose.connect("mongodb://localhost:27017");

exports.reqFriend=(user,friend,res)=>{
	var tf=mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var db=client.db("pickup");
		//if other person has req friend, call acceptFriend(exist in their friend list)

		db.collection("users").find({"username":friend}).toArray()
		.then((arr=>{
			var friends=arr[0]["friends"];
			var req=false;
			for(i=0;i<friends.length;i++){
				if(friends[i]["username"]==user){
					req=true;
					break;
				}
			}
			if(req){
				exports.acceptFriend(user,friend,res);
			}
			else{
				db.collection("users").find({"username":user}).toArray()
				.then((arr)=>{
					var friends=arr[0]["friends"];
					friends.push({"username":friend,"req":"pending"});
					db.collection("users").updateOne({"username":user},{
						$set:{
							"friends":friends
						}
					})
					.then(db.collection("users").find({"username":friend}).toArray()
					.then((arr)=>{
						var feed=arr[0]["feed"];
						feed.push({"type":"friendreq","sender":user});
						db.collection("users").updateOne({"username":friend},{
							$set:{
								"feed":feed
							}
						})
					}).then(()=>{
						res.json();
					}))
				}).catch((err)=>{
					console.log(err);
					res.json(false);
				});
			}
		}))
		
	});
}
exports.acceptFriend=(user,friend,res)=>{
	var tf=mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var db=client.db("pickup");
		db.collection("users").find({"username":friend}).toArray()
		.then((arr)=>{
			var friends=arr[0]["friends"];
			for(i=0;i<friends.length;i++){
				if(friends[i]["username"]==user){
					friends[i]["req"]="accepted";
				}
			}
			db.collection("users").updateOne({"username":friend},{
				$set:{
					"friends":friends
				}
			})
			.then(db.collection("users").find({"username":user}).toArray()
			.then((arr)=>{
				var friends=arr[0]["friends"];
				friends.push({"username":friend,"req":"accepted"});
				var feed=arr[0]["feed"];
				for(i=0;i<feed.length;i++){
					if((feed[i]["type"]=="friendreq")&&(feed[i]["sender"]==friend)){
						feed.splice(i,1);
					}
				}
				db.collection("users").updateOne({"username":user},{
					$set:{
						"friends":friends,
						"feed":feed
					}
				}).then(()=>{
					res.json(arr[0]);
				})
			}))
		}).catch((err)=>{
			console.log(err);
			res.json(false);
		});
	});
}
exports.declineFriend=(user,friend,res)=>{
	
}
exports.removeFriend=(user,friend,res)=>{
	
}
exports.isFriend=(user,friend,res)=>{
	var myUsers ={};
	var tf=mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var db=client.db("pickup");
		db.collection("users").find({"username":user}).toArray()
		.then((arr)=>{
			const friends=arr[0]["friends"];
			var fr=false;
			for(i=0;i<friends.length;i++){
				if(friends[i]["username"]==friend){
					if(friends[i]["req"]=="pending"){
						res.json("pending");
						fr=true;
					}
					else if(friends[i]["req"]=="accepted"){
						res.json("accepted");
						fr=true;
					}
					else{
						res.json(false);
						fr=true;
					}
					break;
				}
			}if(!fr){
				res.json(false);
			}
			client.close();
		}).catch((err)=>{
			res.json(false);
		});
	});
}