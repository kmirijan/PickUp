const mongo = require("mongodb").MongoClient;
const mongourl = "mongodb://pickup:cs115@ds251819.mlab.com:51819/pickup"
const ObjectID = require('mongodb').ObjectID;

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

exports.createTeam = function createTeam(req, res) {
    console.log('[', (new Date()).toLocaleTimeString(), "] Team creating");

    let team = {
        sport: req.body.sport,
        name: req.body.name,
        city: req.body.city,
        captain: req.body.captain,
        members: [req.body.captain],
        games: [],
        maxPlayers: req.body.maxPlayers
    }

    mongo.connect(mongourl, (err, client) => {
        if (err) {
            printErr(err, "Connection to mongo failed for creating Team");
            client.close();
            res.sendStatus(500);
            return;
        }

        let teams = client.db("pickup").collection("teams");
        let users=client.db("pickup").collection("users");
        teams.insertOne(team, (err,ret) => {
            if (err)
            {
                printErr(err, "Adding team failed");
                res.sendStatus(500);
            }
            else
            {
              console.log("insertedId",ret.insertedId)
                users.update({"username":{$in:team["members"]}},{
                    $push:{"teams":ret.insertedId}
                },(err)=>{
                  if(err){
                    printErr(err);
                    res.sendStatus(500);
                  }
                  else{
                    res.sendStatus(200);
                  }
                })

            }
        });

    });

}


// adds the member to the team
exports.joinTeam = function joinTeam(req,res) {

    mongo.connect(mongourl, (err, client) => {
        if (err) {
            printErr(err, "Connection to mongo failed for joining Team");
            client.close();
            res.sendStatus(500);
            return;
        }
        // let teamQuery = {$expr: { $eq: ["$name", {$literal: req.body.teamName} ], $gt: ["$maxPlayers", "$members.length"] } };
        let teamQuery = { _id: ObjectID(req.body.teamId), $where: "this.members.length < this.maxPlayers" };
        let newMember = { $addToSet: {members: req.body.user} }

        let teams = client.db("pickup").collection("teams");
        let users=client.db("pickup").collection("users");
        teams.updateOne(teamQuery, newMember, (err, result) => {
            if (err)
            {
                printErr(err, "Joining team failed");
                res.sendStatus(500);
            }
            else if (result.matchedCount > 0)
            {
              users.updateOne({"username":req.body.user},{
                  $addToSet:{"teams":ObjectID(req.body.teamId)}
              },(err)=>{
                if(err){
                  printErr(err);
                  res.sendStatus(500);
                }
                else{
                  console.log('[', (new Date()).toLocaleTimeString(), "] Team joined");
                  res.sendStatus(200);
                }
              })

            }
            else
            {
                console.log('[', (new Date()).toLocaleTimeString(), "] Team full: join failed");
            }
            client.close();
        });

    });


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
// removes a user from the members list, deletes the team if it
exports.leaveTeam = function leaveTeam (req, res) {
    console.log('[', (new Date()).toLocaleTimeString(), "] Team leaving");

    mongo.connect(mongourl, (err, client) => {
        if (err) {
            printErr(err, "Connection to mongo failed for leaving Team");
            client.close();
            res.sendStatus(500);
            return;
        }

        let teamQuery = {_id: ObjectID(req.body.teamId)};
        let newMember = { $pull: {members: req.body.user} }
        let users =client.db("pickup").collection("users");

        let teams = client.db("pickup").collection("teams");
        teams.findOneAndUpdate(teamQuery, newMember, (err, result) => {
            if (err)
            {
                printErr(err, "Leaving team failed");
                res.sendStatus(500);
                client.close();
                return;
            }
            if (result == null)
            {
                console.log ("Team \"",ObjectID(req.body.teamId), "\" not found. Unable to leave");
            }

            users.update({"username":req.body.user},{
              $pull:{"teams":ObjectID(req.body.teamId)}
            })


            let team = result.value;
            if (team.captain == req.body.user) {
                teams.deleteOne(teamQuery, (err) => {
                    if (err)
                    {
                        printErr(err, "Deleting captainless team failed");
                        res.sendStatus(500);
                    }
                    else
                    {
                        console.log('[', (new Date()).toLocaleTimeString(), "] Deleting team");
                        res.sendStatus(200);
                    }
                    while (team.members.length > 0)
                    {
                        users.update({"username":team.members.pop()}, {$pull: {"teams":ObjectID(req.body.teamId)}});
                    }
                    client.close();
                });
            }
            else {
                res.sendStatus(200);
                client.close();
            }

        })


    });


}
