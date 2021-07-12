import cors from 'cors';
import { initServer, setUpWebSockets } from './Server';
import eventService from './services/events/event-service';
import { eventStreamHandler } from './eventStremHandler';

const {io, app} = initServer();
app.use(cors());

setUpWebSockets(io);
const eventInterval = 2000;
eventService.initEventStream(eventInterval);

app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

app.get('/event-stream', eventStreamHandler);

