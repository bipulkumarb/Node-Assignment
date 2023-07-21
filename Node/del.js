var { MongoClient } = require('mongodb');

var url = "mongodb://127.0.0.1:27017";

var client =new  MongoClient(url);

async function createCollection(){
    try{
        client.connect();
        var dbo = client.db("ShortenUrl");
        await dbo.createCollection("urlDatabase");
        console.log("colection created");
    }
    catch(err){
        console.log(err);
    }
    client.close();
}

createCollection();