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

exports.jointT=(req, res) =>
{
  console.log('[', (new Date()).toLocaleTimeString(), "] Game joined");

  mongo.connect(mongoUrl, (err, client) =>
  {
    var collection = client.db("pickup").collection("teamgames");
    var query = {id: req.body.gid, players: { $nin: [req.body.uid] } };
    var newPlayer = { $push: {players: req.body.uid} };

    console.log("user: ", req.body.uid);
    var userQuery = {username: req.body.uid};
    var joinedGame = {$push: {teamgames: req.body.gid}};
    client.db("pickup").collection("users").update(userQuery, joinedGame);

    collection.update(query, newPlayer, (err) =>
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
    players: [makeValid(req.body.user),],
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
exports.gamesT=(req, res) => {
  console.log('patch: ', req.body);

  Game.findOneAndUpdate(
    {'id': req.body.gid},
    {$pull: {players : req.body.uid}},
    {new: true}
  )
  .then((game) =>{
    console.log('length: ', game.players.length)
    console.log('req: ', req.body);
    if(game.players.length === 0){
      game.remove();
    }
    res.status(200).send({game});
  }).catch((e) => {
    res.status(400).send(e);
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
    db=client.db("pickup");
    db.collection("users").find({"username":req.body.user}).toArray((player)=>{
      const teams=player[0]["teams"];
      db.collection("teams").find({name: {$in:teams}}).toArray((teams)=>{
        res.json(teams);
        client.close();
      });
    })
  })
}
