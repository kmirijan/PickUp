const mongo=require("mongodb").MongoClient;

// Checks for expired games and deletes them
exports.removeExpiredGames = function removeExpiredGames(mongoUrl) {
  mongo.connect(mongoUrl, (err, client) => {
    if (err)
    {
      console.log("Mongo connection failed on removing expired games");
      return;
    }
        
    let currentTime = (new Date()).getTime();

    let query = { endTime: {$lt: currentTime} };
    let games = client.db("pickup").collection("games");
        
    // Find any games older than the current moment
    games.find(query).toArray( (err, results) => {
      if (err)
      {
        console.log("Failed to find expired games");
        console.log(err);
        client.close();
        return;
      }
            
      if (results.length > 0)
      {
        let gameIds = [];
        for (var i = 0; i < results.length; i++)
        {
          gameIds.push(results[i].id);
        }
        games.deleteMany({id: {$in: gameIds}}, (err) => {
          if (err) {
            console.log("Failed to delete expired games");
            console.log(err);
            client.close();
            return;
          }
                    
          let users = client.db("pickup").collection("users");
          users.updateMany({}, {$pull: { games: gameIds}}, (err) => {
            if (err) {
              console.log("Failed to remove expired games from users");
              console.log(err);
            }
            else {
              console.log('[', (new Date()).toLocaleTimeString(), "] ", gameIds.length, " expired games deleted");
            }
            client.close();
          });
        });
      }
      else {
        client.close();
      }
       
    });

  });
}

