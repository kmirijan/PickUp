const mongo=require("mongodb").MongoClient;

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
        
        games.deleteMany(query, (err, results) => {
            client.close();
            if (err)
            {
                console.log("Failed to delete expired games");
                console.log(err);
            }
            
            if (results.deletedCount != 0)
            {
                console.log('[', (new Date()).toLocaleTimeString(), "] ", results.deletedCount, " expired games deleted");
            }
        
        });

    });
}



