const express = require('express');
const app = express();
const port = 3000;
const MongoClient = require('mongodb').MongoClient;


async function updateShortUrl(shortUrl, newDestinationUrl) {
    const client = await MongoClient.connect('mongodb://localhost:27017/', { useUnifiedTopology: true });
    const dbo = client.db('ShortUrl');
    const collection = dbo.collection('urlDatabase');
    await collection.updateOne(
      { shortUrl: shortUrl },
      { $set: { destinationUrl: newDestinationUrl } }
    );
    console.log(`Document updated`);
    client.close();
  }
 


 function generateShortUrl() {
    const prefix = 'www.ppa.in/';
    const allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 30 - prefix.length;
     let shortUrl = prefix;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allowedCharacters.length);
      shortUrl += allowedCharacters[randomIndex];
    }
     return shortUrl;
  }
 
function calculateExpirationDate() {
    

  const currentDate = new Date();
  const daysInMonth = 30;
  const urlCountPerMonth = 5000;
  const readWriteRatio = 100;

  const totalReadWriteOperations = urlCountPerMonth / readWriteRatio;
  const secondsPerDay = 24 * 60 * 60;
  const secondsPerOperation = secondsPerDay / totalReadWriteOperations;
  const expirationDate = new Date(currentDate.getTime() + (secondsPerOperation * daysInMonth * 1000));

  return expirationDate;

}

function shortenUrl(destinationUrl) {
  let shortUrl = generateShortUrl();
  let expirationDate = calculateExpirationDate();
   dbo.collection('urlDatabase').insertOne({
    shortUrl: shortUrl,
    destinationUrl: destinationUrl,
    expirationDate: expirationDate
  });
   return shortUrl;
}

function getDestinationUrl(shortUrl) {
  let result = db.collection('urlDatabase').findOne({ shortUrl: shortUrl });
   if (result) {
    return result.destinationUrl;
  } else {
    return null;
  }
}
function updateExpiry(shortUrl, daysToAdd) {
  let result = db.collection('urlDatabase').findOne({ shortUrl: shortUrl });
   if (result) {
    let newExpirationDate = result.expirationDate + (daysToAdd * 24 * 60 * 60 * 1000);
     db.collection('urls').updateOne(
      { shortUrl: shortUrl },
      { $set: { expirationDate: newExpirationDate } }
    );
     return true;
  } else {
    return false;
  }
}
app.get('/', (req, res) => {
    res.send('Welcome to the URL shortener service!');
  });
app.get('/short/:shortUrl', (req, res) => {
  let shortUrl = req.params.shortUrl;
  let destinationUrl = getDestinationUrl(shortUrl);
   if (destinationUrl) {
    res.redirect(destinationUrl);
  } else {
    res.status(404).send('Short URL not found');
  }
});
app.listen(port, () => {
  console.log(`Open port ${port}`);
});