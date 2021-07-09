import express from 'express';
import messageService from './services/twitter-analytics/twitter-analytics';
import http from 'http';
import { Server } from 'socket.io';
import eventService from './services/events/event-service';
import { EventData } from './services/events/events';

export const initServer = () => {
    const app = express();
    app.use(express.static('static'));
    const port = 5000;
    
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: '*',
      }
    });
    server.listen(port, () => {
        return console.log(`server is listening on ${port}`);
      });
     return {app, io}; 
}

const setUpEventBroadcasters = (io: Server) => {
  const channel_one = 'channel_one';
  const channel_two = 'channel_two';

  messageService.subscribeToSentimentScore((msg) => {
    console.log(`Emitting the sentiment score`);
    io.emit(channel_one, msg);
  }).catch(e => console.log(`Error when consuming and processing messages on ${channel_one}`));

  eventService.consumeEvents((events: EventData) => {
    io.emit(channel_two, events);
  }).catch(e => console.log(`Error when publishing events to ws clients`, e));
  
}

export const setUpWebSockets = (io: Server) => {
    io.on('connection', (socket) => {
      console.log(`Connection successful ${socket}`);
      setUpEventBroadcasters(io);
      socket.on('disconect', () => {
        console.log(`Client disconnected`);
      });
    });
}