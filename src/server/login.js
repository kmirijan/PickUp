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
    if(data.key!=null){
      loggedin.find({
        "key":data.key
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
  console.log(data.key)
  mongo.connect(url,(err,client)=>{
    var loggedin=client.db("pickup").collection("loggedin");
    if(data.key!=null){
      loggedin.deleteOne({
        "key":data.key
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
var replaceAll=(string,char1,char2)=>{

  if(string.indexOf(char1)==-1){
    console.log("true")
    console.log(string)
    return string;
  }
  else{
    console.log("false")
    return replaceAll(string.replace(char1,char2),char1,char2)
  }
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
        var salt=bcrypt.genSaltSync(10);
        var key=String(bcrypt.hashSync(arr[0]["username"],salt));
        //removes $ in cookies. may not be needed
        var keyReturn=replaceAll(key,'$','0');
        console.log(keyReturn);
        loggedin.update(
          {
            "user":arr[0]["username"]
          },
          {
            $set:{"key":keyReturn}
          },
          {upsert:true}
          ,(err)=>{
          if(err) throw new Error(err);
          res.json({
            "success":true,
  					"user":arr[0]["username"],
            "key":keyReturn
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
