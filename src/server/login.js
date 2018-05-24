const mongo=require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const express=require("express");
const fs=require("fs");
const cheerio=require("cheerio");
const url="mongodb://pickup:cs115@ds251819.mlab.com:51819/pickup";
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
//mongoose.connect("mongodb://localhost:27017");

exports.verifyLogin=(data,res)=>{
  //make user object in loggedin collection
  //$oid = key
  mongo.connect(url,(err,client)=>{
    if(err) throw new Error(err);
    var loggedin=client.db("pickup").collection("loggedin");
    if(data.key!=null && data.key.length==24){
      loggedin.find({
        "_id":ObjectID(data.key)
      },(err,ret)=>{
        if(err){
          res.json({
            "user":null
          })
        }
        else{
          ret.toArray((err,arr)=>{
            if(err) throw new Error(err);
            console.log(arr);
            if(arr[0]==undefined){
              res.json({
              "user":null
              })
            }
            else{
              res.json({
              "user":arr[0]["user"]
              })
            }
          })
        }

    })
  }
    else{
      res.json({
        "user":null
      })
    }
    client.close();
  })
}
exports.logout=(data,res)=>{
  mongo.connect(url,(err,client)=>{
    var loggedin=client.db("pickup").collection("loggedin");
    if(data.key!=null&&data.key.length==24){
      loggedin.deleteOne({
        "_id":ObjectID(data.key)
      }).then(()=>{
        res.end();
      })
    }
    else{
      res.end();
    }
    client.close();
  })
}
exports.signIn=(data,res)=>{
	mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var users=client.db("pickup").collection("users");
    var loggedin=client.db("pickup").collection("loggedin");
		users.find({"email":data["email"]}).toArray()
		.then((arr)=>{
			const hash=arr[0]["password"];
      if(bcrypt.compareSync(data["password"],hash)){
        loggedin.insertOne({
          "user":arr[0]["username"]
        },(err,ret)=>{
          if(err) throw new Error(err);
          res.json({
            "success":true,
  					"user":arr[0]["username"],
            "key":ret.insertedId
          })
        })

      }
      else{
        res.json(
  				{
  					"success":false,
  					"user":null
  				});
      }

			client.close();
		}).catch((err)=>{
			res.json(false);
		})

	});
}
