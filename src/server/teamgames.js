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
    var newTeam = { $addToSet: {teams: req.body.team._id} };
    console.log("team id",req.body.team._id);

    console.log("team: ", req.body.team.name);
    var userQuery = {username: {$in:req.body.team.members}};
    var joinedGame = {$addToSet: {teamgames: req.body.game.id}};
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
    sport: makeValid(req.body.game.sport),
    name: makeValid(req.body.game.name),
    location: makeValid(req.body.game.location),
    isprivate:makeValid(req.body.game.isprivate),
    id: makeValid(req.body.game.gameId),
    owner: makeValid(req.body.game.user),
    teams: makeValid(req.body.game.teams),
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
exports.retrieveSpecificGamesT=(req,res)=>{
  mongo.connect(mongoUrl,(err,client)=>{
    if(err)throw new Error(err);
    client.db("pickup").collection("teamgames").find({id:Number(req.body.id)}).toArray((err,arr)=>{
      if(err)throw new Error(err);
      res.json(arr);
      res.end();
      client.close();
    })
  })
}

//redo
//leave game way to identifying
//if no teams exist, delete game
exports.leaveGameT=(req, res) => {
  mongo.connect(mongoUrl,(err,client)=>{
    if(err) throw new Error(err);
    var db=client.db("pickup");
    db.collection("teamgames").update({id:req.body.game.id},{
        $pull:{
          teams:req.body.team._id
        }
    })
    db.collection("users").update({"username":{$in:req.body.team.members}},{
      $pull:{
        teamgames:req.body.game.id
      }
    })
  })
}

/*
  body = gameId, user
*/
exports.deleteGameT=(req,res)=>
{
  mongo.connect(mongoUrl,(err,client)=>{
    if(err)throw new Error(err);

    var db=client.db("pickup");
    console.log("req body",req.body.teams)
    db.collection("teamgames").remove({"id":req.body.gameId})
    .then((arr)=>{
      const teamsObjects=req.body.teams.map((team)=>{
        if(team!=null&&String(team).length==24){
          return ObjectID(team);
        }
        else {
          return null;
        }
      })

      db.collection("teams").find({"_id":{$in:teamsObjects}}).toArray((err,arr)=>{
        if(err) throw new Error(err);
        var queryArr=[];
        for(var i=0; i<arr.length; i++){
          queryArr=queryArr.concat(arr[i].members);
        }
        db.collection("users").update({'username':{$in:queryArr}},{
          $pull:{teamgames:req.body.gameId}
        }).then(()=>{
          console.log(arr, "deleted");
          res.json();
          client.close();
        })
      })
    })



  });

};

exports.retrievePlayerTeams=(req,res)=>{
  console.log("test body",req.body)
  mongo.connect(mongoUrl,(err,client)=>{
    if(err)throw new Error(err);
    var db=client.db("pickup");
    db.collection("users").find({"username":req.body.user}).toArray((err,player)=>{
      if(err)throw new Error(err);
      const teams=player[0]["teams"];
      console.log("player teams",player[0]["teams"]);
      const teamsObjects=teams.map((team)=>{
        if(team!=null&&String(team).length==24){
          return ObjectID(team);
        }
        else {
          return null;
        }
      }
      );
      db.collection("teams").find({'_id': {$in:teamsObjects}}).toArray((err,teams)=>{
        if(err)throw new Error(err);
        console.log("sent teams",teamsObjects);
        res.json(teams);
        client.close();
      });
    })
  })
}
