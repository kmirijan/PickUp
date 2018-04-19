const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

exports.exist=(collection,item)=>{
	mongo.connect(url,(err,client)=>{
	if(err)throw new Error(err);

	var db=client.db("data")
	const tf=db.collection(collection).find(item);
	client.close();
	return tf;
});


};
exports.valEvent=(name)=>{
	return exports.exist("events",{"name":name});
};
exports.valLocation=(name)=>{
	return exports.exist("locations",{"name":name});
};

