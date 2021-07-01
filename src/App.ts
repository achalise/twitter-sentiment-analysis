import express from 'express';
import axios from 'axios';
import messageService from './services/message-service/messageService';
import Twitter from 'twitter';
import dotenv from 'dotenv';
import needle from 'needle';

const app = express();
const port = 3000;

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
const rules = [{ value: 'giveaway' }];

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
      'Authorization': `Bearer XX`
    }
  });
  responseStream.on('data', (data) => {
    const jsonData = JSON.parse(data);
    console.log(jsonData);
  });
}

streamTwitter().then(d => console.log(`Successfully processed streams`)).catch(e => console.log(`the error `, e))

app.get('/', async (req, res) => {
  await messageService.sendMessage(`Test message sent at time ${Date.now()}`).catch(e => console.log("prduceer error", e));
  res.send('The sedulous hyena ate the antelope!');
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});