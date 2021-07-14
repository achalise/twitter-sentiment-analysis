import { Request, Response } from 'express';
import cors from 'cors';
import { initServer, setUpWebSockets } from './Server';
import eventService from './services/events/event-service';
import { EventData } from './services/events/events';
import  setupTwitterStream  from './services/twitter-analytics/twitter-feed';
import { eventStreamHandler, sentimentStreamHandler } from './eventStreamHandler';

const {io, app} = initServer();
app.use(cors());

setUpWebSockets(io);
const eventInterval = 500;
eventService.initEventStream(eventInterval);
setupTwitterStream();

app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

app.get('/event-stream', eventStreamHandler);

app.get('/sentiment-stream', sentimentStreamHandler);
