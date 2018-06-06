const mongo = require("mongodb").MongoClient;
const mongourl = "mongodb://pickup:cs115@ds251819.mlab.com:51819/pickup"
const ObjectID = require('mongodb').ObjectID;

var {Team} = require('./../../db/team.js');
var {User} = require('./../../db/User.js');

function printErr(err, message)
{
    console.log("Error: ", message);
    console.log(err);
    console.log("\nReturning to normal function");
}


exports.getTeams = function getTeams(req, res) {
    console.log('[', (new Date()).toLocaleTimeString(), "] Retrieving teams");

    mongo.connect(mongourl, (err, client) => {
        if (err) {
            printErr(err, "Connection to mongo failed for retrieving teams");
            client.close();
            res.sendStatus(500);
            return;
        }

        let teams = client.db("pickup").collection("teams");
        teams.find({}).toArray( (err, results) => {
            if (err)
            {
                printErr(err, "retrieving team failed");
                res.sendStatus(500);
            }
            else
            {
                res.status(200);
                res.json(results);
            }
            client.close();
        });

    });
}

//Adds a team to the teams database
exports.makeTeam = (req, res) => {
  var team =  new Team({
    sport: req.body.sport,
    name: req.body.name,
    city: req.body.city,
    captain: req.body.captain,
    members: [req.body.captain],
    games: [],
    maxPlayers: req.body.maxPlayers
  });
  team.save().then((team) => {
      res.status(200).send({team});
    }, (e) => {
      res.status(400).send(e);
  });
}

// Adds a team to a user's teams list
exports.addTeamToUser = (req, res) => {
  console.log('Adding team to user');
  User.findOneAndUpdate(
    {username : req.body.uid},
    {$push: {teams: req.body.tid}},
    {new: true}
  ).then((user) => {
    res.status(200).send({user})
  }, (e) => {
    res.status(400).send(e);
  })
}

// Add user to team's member list
exports.addUserToTeam = (req, res) => {
  Team.findOneAndUpdate(
    {_id : req.body.teamId, members: { $nin: [req.body.user]} },
    {$push: {members: req.body.user}},
    {new: true}
  ).then((team) => {
    res.status(200).send({team})
  }, (e) => {
    res.status(400).send(e);
  })
}
/*
  req.body = teamId, teamMembers
*/
exports.deleteTeam = (req,res)=>{
  mongo.connect(mongourl,(err,client)=>{
    let teams=client.db('pickup').collection('teams');
    let users=client.db('pickup').collection('users');
    //remove game from teams, and the ID from each member of the team
    if(String(req.body.teamId).length!=24){
      printErr(err,"not valid team id");
      res.sendStatus(500);
      return;
    }
    const objectTeamId=ObjectID(req.body.teamId);
    teams.remove({'_id':objectTeamId})
    .then(()=>{
      users.update({'username':{$in:req.body.teamMembers}},{
        $pull:{teams:req.body.teamId}
      })
    .then(()=>{
      res.end();
      client.close();
    })
    })
  })
}

exports.teamLeave = (req, res) => {
  Team.findOneAndUpdate(
    {_id: req.body.teamId},
    {$pull: {members : req.body.user}},
    {new: true}
  )
  .then((team) =>{
    if(team.captain === req.body.user){
      team.remove();
    }
    res.status(200).send({team});
  }).catch((e) => {
    res.status(400).send(e);
  })
}
