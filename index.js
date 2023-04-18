require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const fs = require('fs').promises
const UrlStorage = require("./url.ctrl");
const { stringify } = require('querystring');

class Url {
  constructor(body) {
    this.body = body;
  }

  async saveUrl() {
    const client = this.body;
    console.log(client);
    try {
      const response = await UrlStorage.save(client.url);
      return response;
    } catch(err) {
      return { sucess: false, meg: err};
    }
  }
}

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.urlencoded({ extended:true }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res) => {
  const url = new Url(req.body);
  const response = await url.saveUrl();
  return res.json(response); 
})

app.get('/api/shorturl/:shorturl', async (req, res) => {
  const shortUrl = parseInt(req.params.shorturl);
  const originalUrl = await UrlStorage.getUrlInfo(shortUrl)
  
  if(originalUrl === "error") {
    return res.json({"error": "No short URL found for the given input"});
  }
  return res.redirect(originalUrl);


});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
