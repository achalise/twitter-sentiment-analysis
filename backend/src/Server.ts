import express from 'express';
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
  const channel_two = 'channel_two';

  eventService.consumeEvents((events: EventData) => {
    io.emit(channel_two, events);
  }, `groupEvent${Date.now()}`).catch(e => console.log(`Error when publishing events to ws clients`, e));
  
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