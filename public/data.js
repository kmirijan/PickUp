const mongo=require("mongodb").MongoClient;
const express=require("express");
const fs=require("fs");
const cheerio=require("cheerio");
const url="mongodb://localhost:27017";

var exist=(res,text,eve,loc)=>{
	var tf=mongo.connect(url,(err,client)=>{
		if(err)throw new Error(err);

		var db=client.db("data")
		db.collection("events").count(
			{"name":eve}
		).then((ans)=>{
			if(ans>0){text+="<b>"+eve+"</b> is valid<br>";}
			else{text+="<b>"+eve+"</b> is not valid<br>";}
		}).then(db.collection("locations").count(
			{"name":loc}
		).then((ans)=>{
			if(ans>0){text+="<b>"+loc+"</b> is valid<br>";}
			else{text+="<b>"+loc+"</b> is not valid<br>";}
			res.send(text);
		}));

		client.close();
	});
};

exports.valEL=(res,eve,loc)=>{
	var text="<h1>RESULTS</h1>you searched for <b>"+eve+"</b> in events:<br>=>{soccer,tennis,pool}<br>"
	text+="you searched for <b>"+loc+"</b> in locations:<br>=>{park,123 street, somewhere}<br>"
	exist(res,text,eve,loc);
};

/*
exports.update=(path,id,text)=>{
	fs.readFile(path,(err,data)=>{
		var $=cheerio.load(data);
		console.log($("#head1").html("hello"));
		fs.writeFile(path,$.html());
	});
};
*/




