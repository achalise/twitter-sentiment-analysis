import { Request, Response } from 'express';
import eventService from './services/events/event-service';
import messageService from './services/twitter-analytics/twitter-analytics';
import { EventData } from './services/events/events';
//SSE
const clients = [];
export const eventStreamHandler = (request: Request, response: Response, next) => {

  console.log(`processing event-stream requst`);
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  response.writeHead(200, headers);
  response.write(`data: some data1\n\n`);
  eventService.consumeEvents((events: EventData) => {
    response.write(`data: ${JSON.stringify(events)}\n\n`);
  }, `groupEvent${Date.now()}`).catch(e => console.log(`Error when publishing SSE events`, e));


  let client = {
    id: Date.now(),
    response
  }
  clients.push(client);

  request.on('close', () => {
    console.log(`Request closed: ${client.id}`);
  })

}

export const sentimentStreamHandler = (request: Request, response: Response, next) => {
    console.log(`processing sentiment-stream requst`);
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);
    response.write(`data: some data1\n\n`);
    messageService.subscribeToSentimentScore((message) => {
       console.log(message);
      response.write(`data: ${JSON.stringify(message)}\n\n`);}, `group${Date.now()}`).catch(e => console.log(`Error when publishing sentiment SSE events`, e));
  
  
    let client = {
      id: Date.now(),
      response
    }
    clients.push(client);
  
    request.on('close', () => {
      console.log(`Request closed: ${client.id}`);
    })
}