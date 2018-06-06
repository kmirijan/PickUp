const mongo=require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const express=require("express");
const fs=require("fs");
const cheerio=require("cheerio");
const url="mongodb://pickup:cs115@ds251819.mlab.com:51819/pickup";
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const DEFAULT=0;
//mongoose.connect("mongodb://localhost:27017");
exports.reqFriend=(user,friend,res)=>{
	mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);
		var users=client.db("pickup").collection("users");
		//checks if user is in friend's friend list
		users.find({"username":friend}).toArray((err,arr)=>{
			if(err)throw new Error(err);
			let friends=arr[DEFAULT]["friends"];
			var req=false;
			for(i=0;i<friends.length;i++){
				if(friends[i]["username"]==user){
					req=true;
					break;
				}
			}
			if(req=true){
				exports.acceptFriend(user,friend,res);
				res.end();
				client.close();
			}
			else{
				users.updateOne({"username":user},{
					$push:{"friends":{"username":friend,"req":"pending"}}
				})
				users.updateOne({"username":friend},{
					$push:{"feed":{"type":"friendreq","sender":user}}
				})
				res.end();
				client.close();
			}
		})

	})
}
/*
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
*/
exports.acceptFriend=(user,friend,res)=>{
	mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);
		var users=client.db("pickup").collection("users");
		//checks if user is in friend's friend list
		users.find({"username":friend}).toArray((err,arr)=>{
			if(err)throw new Error(err);
			users.updateOne({"username":friend},{
				$pull:{
					"friends":{"username":user}
				}
			})
			.then(()=>{
				users.updateOne({"username":friend},{
					$push:{
						"friends":{"username":user,"req":"accepted"}
					}
				})
			})
			.then(()=>{
				users.updateOne({"username":user},{
					$push:{
						"friends":{"username":friend,"req":"accepted"}
					},
					$pull:{
						"feed":{"type":"friendreq","sender":friend}
					}
				})
				.then(()=>{
					res.json(arr[DEFAULT]);
					client.close();
				})
			})
		})

	})
}
/*
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
*/

exports.declineFriend=(user,friend,res)=>{
	mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);
		var users=client.db("pickup").collection("users");
		//checks if user is in friend's friend list
		exports.removefriend(user,friend,res);
		users.updateOne({"username":user},{
			$pull:{
				"feed":{"type":"friendreq","sender":friend}
			}
		})
		.then(()=>{
			users.find({"username":user}).toArray((err,arr)=>{
				if(err)throw new Error(err);
				res.json(arr[DEFAULT]);
				client.close();
			})
		})

	})
}
/*
exports.declineFriend=(user,friend,res)=>{
	var tf=mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var db=client.db("pickup");
		db.collection("users").find({"username":friend}).toArray()
		.then((arr)=>{
			var friends=arr[0]["friends"];
			for(i=0;i<friends.length;i++){
				if(friends[i]["username"]==user){
					friends.splice(i,1);
				}
			}
			db.collection("users").updateOne({"username":friend},{
				$set:{
					"friends":friends
				}
			})
			.then(db.collection("users").find({"username":user}).toArray()
			.then((arr)=>{
				var feed=arr[0]["feed"];
				for(i=0;i<feed.length;i++){
					if((feed[i]["type"]=="friendreq")&&(feed[i]["sender"]==friend)){
						feed.splice(i,1);
					}
				}
				db.collection("users").updateOne({"username":user},{
					$set:{
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
*/
exports.removeFriend=(user,friend,res)=>{
	mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);
		var users=client.db("pickup").collection("users");
		//checks if user is in friend's friend list
		exports.removefriend(user,friend,res);
		users.updateOne({"username":user},{
			$pull:{
				"friends":{"username":friend}
			}
		})
		.then(()=>{
			users.updateOne({"username":friend},{
				$pull:{
					"friends":{"username":user}
				}
			})
		})
		.then(()=>{
			users.find({"username":user}).toArray((err,arr)=>{
				if(err)throw new Error(err);
				res.json(arr[DEFAULT]);
				client.close();
			})
		})

	})
}
/*
exports.removeFriend=(user,friend,res)=>{
	var tf=mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var db=client.db("pickup");
		db.collection("users").find({"username":friend}).toArray()
		.then((arr)=>{
			var friends=arr[0]["friends"];
			for(i=0;i<friends.length;i++){
				if(friends[i]["username"]==user){
					friends.splice(i,1);
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
				for(i=0;i<friends.length;i++){
					if(friends[i]["username"]==friend){
						friends.splice(i,1);
					}
				}
				db.collection("users").updateOne({"username":user},{
					$set:{
						"friends":friends
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
*/
exports.isFriend=(user,friend,res)=>{
	var myUsers ={};
	var tf=mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var db=client.db("pickup");
		db.collection("users").find({"username":user}).toArray()
		.then((arr)=>{
			const friends=arr[DEFAULT]["friends"];
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
