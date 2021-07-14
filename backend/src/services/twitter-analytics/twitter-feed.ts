import needle from 'needle';
import messageService from './twitter-analytics';
import dotenv from 'dotenv';
import { MovieDetails, MovieStream } from '../imdb/moviesService';

const config = dotenv.config();
const token = process.env.TWITTER_TOKEN

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

const ingestTwitterStream = async () => {
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
    } catch (e) {
      console.log(`Error when parsing json from the twitter stream`, e);
      console.log(`data being parsed `, data);
    }
  });
}

const ingestMovieStream = async () => {
  for await (let value of MovieStream) {
    let itemeDetails = await value as MovieDetails;
    console.log(`Movie details`, itemeDetails);
    messageService.sendMessage(itemeDetails.plot);
  }
}

const setupTwitterStream  = () => {
    const processTwitterStream = () => messageService.subscribe().catch(error => console.log("Error when subscribing to the message topic", error));
    ingestMovieStream().catch(e => console.log(`Error processing the movie stream`, e));
    processTwitterStream().catch(e => console.log(`Error when processing the the records for sentiment analysis`, e));
    //ingestTwitterStream().then(d => {console.log(`Successfully ingested twitter stream`); processTwitterStream();}).catch(e => console.log(`the error `, e))
}

export default setupTwitterStream;

interface TwitterRecord {
    data: {
      id: string;
      text: string;
    }
  }