const mongo=require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const express=require("express");
const fs=require("fs");
const cheerio=require("cheerio");
const url="mongodb://pickup:cs115@ds251819.mlab.com:51819/pickup";
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
//mongoose.connect("mongodb://localhost:27017");

//get user info
exports.getUsers=(user,res)=>{
	var myUsers ={};
	mongo.connect(url,(err,client)=>{
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

//checks if is valid user in database
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

//saves Profile changes
exports.saveProfile=(data,res)=>{
	var tf=mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var db=client.db("pickup");
		db.collection("users").updateMany({"username":data["username"]},{
			$set:{
				"alias":data["alias"],
				"bio":data["bio"],
				"pic":data["pic"],
				"email":data["email"]
			}
		})
		.then(()=>{
			res.json();
			client.close();
		});
	});
}



//returns the usernames of all users
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

//get user email
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

//sets user email
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

//sets password
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

//upload profile picture
exports.uploadProfilePicture=(file,user,filetype,res)=>{

	const filePath="./dist/profilePictures/"+user+filetype;
	console.log(filePath);
	fs.rename(file,filePath,(err)=>{
		if(err)throw new Error(err);
	})
	console.log("file uploaded");
	mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);
		var db=client.db("pickup");
		db.collection("users").update({"username":user},{
			$set:{
				"pic":"/profilepictures/"+user+filetype
			}
		}).then(()=>{
			res.json(filePath);
			client.close();
		})
	})
}
