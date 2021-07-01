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
  consumer_key: 'LS4aFnTBkCdN0yoGk0Hd4nJDT',
  consumer_secret: 'bYQXHvp1svtpYhih4UVHUAkNn5a4nwtDqbv1t9rl0FsFg4hM0h',
  bearer_token: 'AAAAAAAAAAAAAAAAAAAAAAiARAEAAAAA4Sxcus275hP38IKgS53L7DfpoBQ%3DLjKhsxdbgKPCuMWesD0x7JuL2nbiXIVfx6IiNBVCzZhIDiRy3g',
  access_token_key: '292869441-uuDwBDUonxD1LjC2h7o0QCrs5MjIGGPTSleVNuFG',
  access_token_secret: 'ayTrGj33Vs4p6kHAR9spVMCPhkRqqXIzptdyLcxqfECQm'
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
      'Authorization': `Bearer AAAAAAAAAAAAAAAAAAAAAAiARAEAAAAA4Sxcus275hP38IKgS53L7DfpoBQ%3DLjKhsxdbgKPCuMWesD0x7JuL2nbiXIVfx6IiNBVCzZhIDiRy3g`
    }
  });
  responseStream.on('data', (data) => {
    const jsonData = JSON.parse(data);
    console.log(jsonData);
  });
}

streamTwitter().then(d => console.log(`Successfully processed streams`)).catch(e => console.log(`the error `, e))

// client.get('search/tweets', {q: 'node.js'}, function(error, tweets, response) {
//   console.log(tweets);
// });

//curl --location --request -H "Authorization: Bearer AAAAAAAAAAAAAAAAAAAAAAiARAEAAAAA4Sxcus275hP38IKgS53L7DfpoBQ%3DLjKhsxdbgKPCuMWesD0x7JuL2nbiXIVfx6IiNBVCzZhIDiRy3g" GET 'https://api.twitter.com/2/tweets/sample/stream'
// axios.get(`https://api.twitter.com/2/tweets/search/stream`, {
//   headers: {
//     'Authorization': `Bearer AAAAAAAAAAAAAAAAAAAAAAiARAEAAAAA4Sxcus275hP38IKgS53L7DfpoBQ%3DLjKhsxdbgKPCuMWesD0x7JuL2nbiXIVfx6IiNBVCzZhIDiRy3g`
//   }
// }).then(res => console.log(`The response`, res.data)).catch(e => console.log(`caught error`, e)).finally(() => {
//   console.log(`finally block`);
// });

// var stream = client.stream('statuses/filter', {track: 'javascript'});
// stream.on('data', function(event) {
//   console.log(event && event.text);
// });

// stream.on('error', function(error) {
//   console.log(error);
//   throw error;
// });
app.get('/', async (req, res) => {
  await messageService.sendMessage(`Test message sent at time ${Date.now()}`).catch(e => console.log("prduceer error", e));
  res.send('The sedulous hyena ate the antelope!');
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});