import { Request, Response } from 'express';
import eventService from './services/events/event-service';
import { EventData } from './services/events/events';
//SSE
const clients = [];
export const eventStreamHandler = async (request: Request, response: Response, next) => {

  console.log(`processing event-stream requst`);
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  response.writeHead(200, headers);
  response.write(`data: some data1\n\n`);
  const unsubscribe = await eventService.consumeEvents((events: EventData) => {
    response.write(`data: ${JSON.stringify(events)}\n\n`);
  }, `groupEvent${Date.now()}`);


  let client = {
    id: Date.now(),
    response
  }
  clients.push(client);

  request.on('close', () => {
    console.log(`Request closed: ${client.id}`);
    unsubscribe().catch(e => console.log(`Error when publishing SSE events`, e));;
  })
}

