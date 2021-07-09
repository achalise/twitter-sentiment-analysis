import { Request, Response } from 'express';
import { initServer, setUpWebSockets } from './Server';
import eventService from './services/events/event-service';
import { EventData } from './services/events/events';
import  setupTwitterStream  from './services/twitter-analytics/twitter-feed';

const {io, app} = initServer();

setUpWebSockets(io);
const eventInterval = 50;
eventService.initEventStream(eventInterval);
setupTwitterStream();

app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

//SSE
const clients = [];
const eventStreamHandler = (request: Request, response: Response, next) => {

  console.log(`processing event-stream requst`);
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  response.writeHead(200, headers);
  eventService.consumeEvents((events: EventData) => {
    response.write(`${JSON.stringify(events)}\n\n`);
  }, `groupEvent${Date.now()}`).catch(e => console.log(`Error when publishing SSE events`, e));


  let client = {
    id: Date.now(),
    response
  }
  clients.push(client);

  request.on('close', () => {
    console.log(`Request closed: ${client.id}`);
    //clearInterval(int);
  })

}
app.get('/event-stream', eventStreamHandler);

