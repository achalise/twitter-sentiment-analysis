import express from 'express';
import axios from 'axios';
import messageService from './services/message-service/messageService';
import Twitter from 'twitter';
import dotenv from 'dotenv';
import needle from 'needle';
import http from 'http';
import {Server} from 'socket.io';

const app = express();
app.use(express.static('static'));
const port = 3000;

// let http = require("http").Server(app);
// // set up socket.io and bind it to our
// // http server.
// let io = require("socket.io")(http);

const server = http.createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
  console.log(`Connection successful ${socket}`);
  messageService.subscribeToSentimentScore((msg) => {
    console.log(`Emitting the sentiment score`);
    io.emit('chat message', msg);
  })
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
  socket.on('disconect', () => {
    console.log(`Client disconnected`);
  });  
});

messageService.subscribe().catch(error => console.log("Error when subscribing to the message topic", error));


const config = dotenv.config();
const token = process.env.TWITTER_TOKEN
console.log(`token ${token}`);

const client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  bearer_token: '',
  access_token_key: '',
  access_token_secret: ''
})

const rulesURL = new URL(
  "https://api.twitter.com/2/tweets/search/stream/rules"
);
const rules = [{ value: 'network' }];

async function setRules() {
  const data = {
    add: rules,
  }

  const response = await needle('post', rulesURL.toString(), data, {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
}
setRules().then(d => console.log("successfully set the rules"));

const streamTwitter = async () => {
  await setRules();
  const responseStream = needle.get(`https://api.twitter.com/2/tweets/search/stream`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  responseStream.on('data', (data: string) => {
    try {
      const twitterRecord = JSON.parse(data) as TwitterRecord;
      messageService.sendMessage(twitterRecord.data.text);
    } catch(e) {
      console.log(`Error when parsing json from the twitter stream`);
    }
  });
}

streamTwitter().then(d => console.log(`Successfully processed streams`)).catch(e => console.log(`the error `, e))

app.get('/', async (req, res) => {
  await messageService.sendMessage(`Test message sent at time ${Date.now()}`).catch(e => console.log("prduceer error", e));
  res.sendFile(__dirname + '/static/index.html');
});

server.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});

interface TwitterRecord {
  data: {
    id: string;
    text: string;
  }
}