import { initServer, setUpWebSockets } from './Server';
import eventService from './services/events/event-service';
import  setupTwitterStream  from './services/twitter-analytics/twitter-feed';

const {io, app} = initServer();
setUpWebSockets(io);
const eventInterval = 5000;
eventService.initEventStream(eventInterval);
setupTwitterStream();

app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});