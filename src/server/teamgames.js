const mongo=require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const express=require("express");
const fs=require("fs");
const cheerio=require("cheerio");
const url="mongodb://pickup:cs115@ds251819.mlab.com:51819/pickup";
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
//mongoose.connect("mongodb://localhost:27017");

/*----------------------------------------------------------------------------------------*/
const makeValid = (obj) => {return obj != null ? obj : "";};
var mongoUrl = 'mongodb://pickup:cs115@ds251819.mlab.com:51819/pickup';

exports.joinT=(req, res) =>
{
  console.log('[', (new Date()).toLocaleTimeString(), "] Game joined");

  mongo.connect(mongoUrl, (err, client) =>
  {
    var collection = client.db("pickup").collection("teamgames");
    var query = {id: req.body.game.id, teams: { $nin: [req.body.team] } };
    var newTeam = { $push: {teams: req.body.team.id} };

    console.log("team: ", req.body.team.name);
    var userQuery = {username: {$in:req.body.team.members}};
    var joinedGame = {$push: {teamgames: req.body.game.id}};
    client.db("pickup").collection("users").update(userQuery, joinedGame);

    collection.update(query, newTeam, (err) =>
    {
      if (err) throw err;
      client.close();
    });

  });

};


exports.nearbyGamesT=(req, res) => {
    console.log('[', (new Date()).toLocaleTimeString(), "] Nearby games sending");

    let range = req.body.range;
    let center = req.body.center;

    mongo.connect(mongoUrl, (err, client) =>{
        if (err) throw err;

        let collection = client.db("pickup").collection("teamgames");

        let query = {"coords.lat": {$gt: center.lat - range.lat, $lt: center.lat + range.lat},
                "coords.lng": {$gt: center.lng - range.lng, $lt: center.lng + range.lng }

        };
        collection.find(query).toArray((err, result) => {
            if (err) throw err;
            console.log(result);
            res.json(result);
            res.end();
            client.close();
        });

    });
};


// return the games that the user has played
exports.userGamesT=(req, res) => {
    console.log('[', (new Date()).toLocaleTimeString(), "] Sending ", req.body.user.trim(), "'s games");

    mongo.connect(mongoUrl, (err, client) => {
        if (err) throw err;
        let username = {username: req.body.user.trim()};
        let users = client.db("pickup").collection("users");
        let games = client.db("pickup").collection("teamgames");
        users.findOne(username, (err, user) => {
            let userGames = {id: {$in: user.teamgames} };
            games.find(userGames).toArray((err, results) => {
                if (err) throw err;
                res.json(results);
                res.end();
                client.close();
            });
        });

    });
};

// add a game to the data base
exports.postGamesT= (req, res) =>
{
  console.log('[', (new Date()).toLocaleTimeString(), "] Game received");
  var game = {
    sport: makeValid(req.body.sport),
    name: makeValid(req.body.name),
    location: makeValid(req.body.location),
    isprivate:makeValid(req.body.isprivate),
    id: makeValid(req.body.gameId),
    owner: makeValid(req.body.user),
    teams: makeValid(req.body.teams),
    coords: req.body.coords,
  };


  mongo.connect(mongoUrl, (err, db) => {
    if (err) throw err;

    db.db("pickup").collection("teamgames").insertOne(game,() => {
      db.db("pickup").collection("users").update({"username":game["owner"]},{
        $push: {teamgames: game["id"]}
      }).then(()=>{
        res.sendStatus(200);
        db.close();
      })
    });

   });

  /*
  game.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
  })
  */
};

exports.retrieveGamesT=(req, res) =>
{
  console.log('[', (new Date()).toLocaleTimeString(), "] Games sending");

  mongo.connect(mongoUrl, (err, db) => {
    if (err) throw err;
    db.db("pickup").collection("teamgames").find({}).toArray((err, result) => {
      if (err) throw err;
      res.json(result);
      res.end();
      db.close();


    });


  });

};

//redo
//leave game way to identifying
exports.leaveGameT=(req, res) => {
  mongo.connect(mongoUrl,(err,client)=>{
    if(err) throw new Error(err);
    var db=client.db("pickup");
    db.collection("teamgames").update({id:req.body.game.id},{
        $pull:{
          teams:req.body.team.name
        }
    })
  })
}

exports.deleteGameT=(req,res)=>
{
  mongo.connect(mongoUrl,(err,client)=>{
    if(err)throw new Error(err);

    var db=client.db("pickup");
    db.collection("teamgames").remove({"id":req.body.gameId})
    .then((arr)=>{
      console.log(arr, "deleted");
      res.json();
      client.close();
    })
  });

};

exports.retrievePlayerTeams=(req,res)=>{
  mongo.connect(mongoUrl,(err,client)=>{
    if(err)throw new Error(err);
    var db=client.db("pickup");
    db.collection("users").find({"username":req.body.user}).toArray((err,player)=>{
      if(err)throw new Error(err);
      const teams=player[0]["teams"];
      console.log(player[0]["teams"]);
      db.collection("teams").find({name: {$in:teams}}).toArray((err,teams)=>{
        if(err)throw new Error(err);
        res.json(teams);
        client.close();
      });
    })
  })
}
