const mongo=require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const express=require("express");
const fs=require("fs");
const cheerio=require("cheerio");
const url="mongodb://pickup:cs115@ds251819.mlab.com:51819/pickup";
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
//mongoose.connect("mongodb://localhost:27017");

exports.getUsers=(user,res)=>{
	var myUsers ={};
	var tf=mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var db=client.db("pickup");
		db.collection("users").find({"username":user}).toArray()
		.then((arr)=>{
			res.json(arr);
			client.close();
		}).catch((err)=>{
			res.json(false);
		});
	});
}

exports.isUser=(user,res)=>{
	mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);
		var db=client.db("pickup");
		db.collection("users").count({"username":user}).then((count)=>{
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

exports.saveProfile=(data,res)=>{
	var tf=mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var db=client.db("pickup");
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

/*http://codetheory.in/using-the-node-js-bcrypt-module-to-hash-and-safely-store-passwords/*/
exports.signUp=async (data,res)=>{
	var tf= mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var db=client.db("pickup");

		db.collection("users").count({"email":data["email"]})
		.then((count)=>{
			if(count>0){
				res.json("email is already in use");
			}
			else
			{
				db.collection("users").count({"username":data["username"]})
				.then((count)=>{
					if(count>0){
						res.json("username is already in use")
					}
					else{
						var salt=bcrypt.genSaltSync(10);
						var hash=bcrypt.hashSync(data["password"],salt);
						data["password"]=hash;

						db.collection("users").insertOne(data)
						.then(()=>{
							res.json(true);
							client.close();
						});
					}
				})
			}
		})
	});
}

exports.signIn=(data,res)=>{
	var tf=mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var db=client.db("pickup");
		db.collection("users").find({"email":data["email"]}).toArray()
		.then((arr)=>{
			const hash=arr[0]["password"];
			res.json(
				{
					"success":bcrypt.compareSync(data["password"],hash),
					"user":arr[0]["username"]
				});
			client.close();
		}).catch((err)=>{
			res.json(false);
		})

	});
}

exports.getAllUsers=(res)=>{
	var tf=mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var db=client.db("pickup");
		db.collection("users").find({}).toArray()
		.then((arr)=>{
			var usernames=[];
			for(i=0; i<arr.length; i++){
				usernames[i]=arr[i]["username"];
			}
			res.json(usernames);
		})
	})
}
exports.getEmail=(user,res)=>{
	var tf=mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var db=client.db("pickup");
		db.collection("users").find({"username":user}).toArray()
		.then((arr)=>{
			res.json(arr[0]["email"]);
		})
	})
}
exports.setEmail=(user,email,res)=>{
	var tf=mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var db=client.db("pickup");
		db.collection("users").count({"email":email})
		.then((count)=>{
			if(count>0){
				res.json("email is already in use");
			}
			else{
				db.collection("users").updateOne({"username":user},{
					$set:{"email":email}
				})
				.then((arr)=>{
					res.json();
				})
			}
		})
	})
}
exports.setPassword=(user,oldPassword,newPassword,res)=>{
	var tf=mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var db=client.db("pickup");
		db.collection("users").find({"username":user}).toArray()
		.then((arr)=>{
			const hash=arr[0]["password"];
			if(bcrypt.compareSync(oldPassword,hash)){
				var salt=bcrypt.genSaltSync(10);
				db.collection("users").updateOne({"username":user},{
					$set:{
						"password":bcrypt.hashSync(newPassword,salt)
					}
				}).then(()=>{
					res.json();
				})
			}
			else{
				res.json("the password you entered is incorrect");
			}
		})
	})
}
