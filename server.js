require('./config/config.js');
const express=require("express");
const mongo=require("mongodb").MongoClient;
var {mongoose} = require('./db/mongoose.js');
const bodyParser=require("body-parser");
const mkprofile=require("./src/server/mkprofile.js");
const friends=require("./src/server/friends.js");
const gamepage=require("./src/server/gamepage.js");
const teams=require("./src/server/teams.js");
const timedRemove=require("./src/server/timedRemove.js");
const teamgames=require("./src/server/teamgames.js");
const login=require("./src/server/login.js")
const fs=require("fs");
const busboy=require("connect-busboy");
const util = require('util')
const app=express();
const http=require("http").Server(app);

//deploy app
const port=process.env.PORT;
http.listen(port,()=>{
    console.log(port);
    console.log(process.env.NODE_ENV);
    console.log(process.env.MONGODB_URI);
});

const io=require("socket.io")(http);
//socket.io----------------------------------
io.on('connection',(socket)=>{
  console.log("someone joined");
  socket.on("send",(m)=>{
    console.log(m);
    let messageWithTime={
      sender:m["sender"],
      message:m["message"],
      time:(new Date()).toLocaleTimeString()
    }
    io.emit("message",messageWithTime)
  })
});



var {Game} = require('./db/game.js');
var {User} = require('./db/User.js');

//var mongoUrl = 'mongodb://pickup:cs115@ds251819.mlab.com:51819/pickup';




/*configurations*/
app.use(express.static("./dist"));
app.use(bodyParser.json());
app.use(busboy());
app.use("/profilepictures",express.static("./dist/profilePictures"));
/*app.use(bodyParser.urlencoded({
  extended: true
}));*/

/*sends index.html to any link*/
app.get("*",(req,res)=>{
  res.sendFile(__dirname+"/dist/index.html");
  console.log('[', (new Date()).toLocaleTimeString(), "] Main file sending");
});

//-----------------login------------------------
app.post("/verify-login",(req,res)=>{
  login.verifyLogin(req.body,res);
})
app.post("/signin-test",(req,res)=>{
  login.signIn(req.body,res);
})
app.delete("/logout-test",(req,res)=>{
  login.logout(req.body,res);
})

// --------------- Team related requests --------------
app.post("/postteam", teams.createTeam);
app.post("/retrieveteams", teams.getTeams);
app.post("/jointeam", teams.joinTeam);
app.patch("/team", teams.leaveTeam);
app.post("/deleteteam",teams.deleteTeam);

//-------------==homepage-------------------------------
app.post("/get-players-and-games-count",(req,res)=>{
  var gamescount=0;
  var userscount=0;
  mongo.connect(mongoUrl, (err, client) =>
  {
    if(err) throw new Error(err);
    var games=client.db("pickup").collection("games");
    var users=client.db("pickup").collection("users");
    var teamgames=client.db("pickup").collection("teamgames");

    games.count({}).then((numberOfGames)=>{
      gamescount=gamescount+numberOfGames;
      teamgames.count({}).then((numberOfTeamGames)=>{
        gamescount=gamescount+numberOfTeamGames;
        users.count({}).then((numberOfUsers)=>{
          userscount=userscount+numberOfUsers;
          res.json({
            games:gamescount,
            users:userscount
          })
          res.end();
          client.close();
        })
      })
    });
  });

})
// --------------- User relate requests ---------------
app.post("/user",(req,res)=>{
	mkprofile.getUsers(req.body.user,res);
});
app.post("/isuser",(req,res)=>{
  mkprofile.isUser(req.body.user,res);
})
app.post("/saveprofile",(req,res)=>{
	mkprofile.saveProfile(req.body,res);
});
app.post("/signup",(req,res)=>{
	mkprofile.signUp(req.body,res);
});
app.post("/signin",(req,res)=>{
	mkprofile.signIn(req.body,res);
});
app.post("/getallusers",(req,res)=>{
  mkprofile.getAllUsers(res);
});
app.post("/getemail",(req,res)=>{
  mkprofile.getEmail(req.body["user"],res);
});
app.post("/setemail",(req,res)=>{
  mkprofile.setEmail(req.body["user"],req.body["email"],res);
});
app.post("/setpassword",(req,res)=>{
  mkprofile.setPassword(req.body["user"],req.body["oldPassword"],req.body["newPassword"],res);
});
app.post("/uploadprofilepicture",(req,res)=>{
  /*https://stackoverflow.com/questions/23114374/file-upl
  oading-with-express-4-0-req-files-undefined?utm_med
  ium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa*/
  var body={};
  var tempPath="";
  req.busboy.on("field",(fieldname,val)=>{
    body[fieldname]=val;
    if(fieldname=="user"){
      tempPath="./dist/"+val;
    }
  });
  req.busboy.on("file",(fieldname,file,filename)=>{
    console.log(tempPath);
    fstream=fs.createWriteStream(tempPath);
    file.pipe(fstream);
  });
  req.busboy.on("finish",()=>{
    mkprofile.uploadProfilePicture(tempPath,body["user"],body["filetype"],res);
  })
  req.pipe(req.busboy);
})
app.post("/reqfriend",(req,res)=>{
  friends.reqFriend(req.body["user"],req.body["friend"],res);
})
app.post("/acceptfriend",(req,res)=>{
  friends.acceptFriend(req.body["user"],req.body["friend"],res);
})
app.post("/isfriend",(req,res)=>{
  friends.isFriend(req.body["user"],req.body["friend"],res);
})
app.post("/declinefriend",(req,res)=>{
  friends.declineFriend(req.body["user"],req.body["friend"],res);
})
app.post("/removefriend",(req,res)=>{
  friends.removeFriend(req.body["user"],req.body["friend"],res);
})
app.post("/isgame",(req,res)=>{
  gamepage.isGame(req.body["id"],res);
})
app.post("/isgamet",(req,res)=>{
  gamepage.isGameT(req.body["id"],res);
})


/*----------------------------------------------------------------------------------------*/
const makeValid = (obj) => {return obj != null ? obj : "";};
var mongoUrl = 'mongodb://pickup:cs115@ds251819.mlab.com:51819/pickup';

app.post("/join", (req, res) =>
{
  console.log('[', (new Date()).toLocaleTimeString(), "] Game joined");

  mongo.connect(mongoUrl, (err, client) =>
  {
    var collection = client.db("pickup").collection("games");
    var query = {id: req.body.gid, players: { $nin: [req.body.uid] } };
    var newPlayer = { $push: {players: req.body.uid} };

    console.log("user: ", req.body.uid);
    var userQuery = {username: req.body.uid, games: {$nin: [req.body.gid]}};
    var joinedGame = {$push: {games: req.body.gid}};
    client.db("pickup").collection("users").update(userQuery, joinedGame);

    collection.update(query, newPlayer, (err) =>
    {
      if (err) throw err;
      client.close();
    });

  });

});


app.post("/nearbygames", (req, res) => {
    console.log('[', (new Date()).toLocaleTimeString(), "] Nearby games sending");

    let range = req.body.range;
    let center = req.body.center;

    mongo.connect(mongoUrl, (err, client) =>{
        if (err) throw err;

        let collection = client.db("pickup").collection("games");

        let query = {coords:
                        {$near:
                            {
                                $geometry: {
                                    type: "Point",
                                    coordinates: [center.lng, center.lat]
                                },
                                $maxDistance: range * 1000,
                            }
                        },
                    isprivate: false
        };
        collection.find(query).toArray((err, result) => {
            if (err) throw err;
            res.json(result);
            res.end();
            client.close();
        });

    });
});


// return the games that the user has played
app.post("/usergames", (req, res) => {
  console.log(req.body.user)
    console.log('[', (new Date()).toLocaleTimeString(), "] Sending ", req.body.user.trim(), "'s games");

    mongo.connect(mongoUrl, (err, client) => {
        if (err) throw err;
        let username = {username: req.body.user.trim()};
        let users = client.db("pickup").collection("users");
        let games = client.db("pickup").collection("games");
        users.findOne(username, (err, user) => {
            let userGames = {id: {$in: (user.games != null ? user.games : [])} };
            games.find(userGames).toArray((err, results) => {
                if (err) throw err;
                res.json(results);
                res.end();
                client.close();
            });
        });

    });
});

// add a game to the data base
app.post("/postgames", (req, res) =>
{
  console.log('[', (new Date()).toLocaleTimeString(), "] Game received");

  var game = new Game({
    sport: makeValid(req.body.sport),
    name: makeValid(req.body.name),
    location: makeValid(req.body.location),
    isprivate:makeValid(req.body.isprivate),
    id: makeValid(req.body.id),
    owner: makeValid(req.body.user),
    players: [makeValid(req.body.user),],
    coords: {type: "Point", coordinates: [req.body.lng, req.body.lat] },
    startTime: req.body.startTime,
    endTime: req.body.startTime + req.body.gameLength
  });

  console.log(game);
  game.save().then((game) => {
      res.status(200).send({game});
    }, (e) => {
      console.log(e);
      res.status(400).send(e);
  })
});

// add user to game
app.patch('/game:user', (req, res) => {
  //console.log('Adding user to game');
  //console.log(req.body);
  Game.findOneAndUpdate(
    {id : req.body.gid, players: { $nin: [req.body.uid]} },
    {$push: {players: req.body.uid}},
    {new: true}
  ).then((game) => {
    //console.log(game);
    res.status(200).send({game})
  }, (e) => {
    res.status(400).send(e);
  })
})

// Add game to user
app.patch('/user:game', (req, res) => {
  console.log('Adding game to user');
  User.findOneAndUpdate(
    {username : req.body.uid},
    {$push: {games: req.body.gid}},
    {new: true}
  ).then((user) => {
    console.log(user);
    res.status(200).send({user})
  }, (e) => {
    res.status(400).send(e);
  })
})

app.post("/retrievegames", (req, res) =>
{
  console.log('[', (new Date()).toLocaleTimeString(), "] Games sending");

  mongo.connect(mongoUrl, (err, db) => {
    if (err) throw err;
    db.db("pickup").collection("games").find({}).toArray((err, result) => {
      if (err) throw err;
      res.json(result);
      res.end();
      db.close();
    });
  });
});


app.patch('/leave:games', (req, res) => {
  // console.log('patch: ', req.body);
  Game.findOneAndUpdate(
    {'id': req.body.gid},
    {$pull: {players : req.body.uid}},
    {new: true}
  )
  .then((game) =>{
    // console.log('length: ', game.players.length)
    // console.log('req: ', req.body);
    if(game.players.length === 0){
      game.remove();
    }
    res.status(200).send({game});
  }).catch((e) => {
    res.status(400).send(e);
  })
})

app.delete('/games', (req, res) => {
  // console.log('deleting', req.body);
  console.log("testing games",req.body.gid)
  Game.findOneAndRemove({'id': req.body.gid})
  .then((game) =>{
    User.findOneAndUpdate(
      {'username': req.body.owner},
      {$pull: {games : req.body.gid}},
      {new: true}
    )
    .then(()=>{
      res.status(200).send({game});
    }).catch((e) => {
      res.status(400).send(e);
    })
  // console.log("Deleting", game);

  }).catch((e) => {
    res.status(400).send(e);
  })
})


app.post("/retrievespecificgames", (req,res)=>{
  mongo.connect(mongoUrl,(err,client)=>{
    if(err)throw new Error(err);
    client.db("pickup").collection("games").find({id:Number(req.body.id)}).toArray((err,arr)=>{
      if(err)throw new Error(err);
      res.json(arr);
      res.end();
      client.close();
    })
  })

})
app.post("/joinT", (req, res) =>{
  teamgames.joinT(req,res);
});
app.post("/nearbygamesT", (req, res) => {
  teamgames.nearByGamesT(req,res);
});
app.post("/usergamesT", (req, res) => {
  teamgames.userGamesT(req,res);
});
app.post("/postgamesT", (req, res) =>{
  teamgames.postGamesT(req,res);
});
app.post("/retrievegamesT", (req, res) =>{
  teamgames.retrieveGamesT(req,res);
});
app.post("/retrievespecificgamesT",(req,res)=>{
  teamgames.retrieveSpecificGamesT(req,res);
})
app.post('/leavegameT', (req, res) => {
  teamgames.leaveGameT(req,res);
})
app.post("/deletegameT",(req,res)=>{
  teamgames.deleteGameT(req,res);
});
app.post("/retrieveplayerteams",(req,res)=>{
  teamgames.retrievePlayerTeams(req,res);
})


// interval in milliseconds
var removeInterval = 60*1000;
timedRemove.removeExpiredGames(mongoUrl); // do it immedieately just to make sure
setInterval(timedRemove.removeExpiredGames, removeInterval, mongoUrl);

module.exports = {app};
