import React, { useEffect, useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';
import LineChart, { ChartData } from './charts/LineChart';

function App() {
  const [data, setData] = useState<ChartData[]>([]);
  const [sData, setSData] = useState<ChartData[]>([]);

  useEffect(() => {
      const socket = io('http://localhost:5000');
      socket.on('channel_two', (chartData: ChartData[]) => {
        console.log(`received events `, chartData);
        setData(chartData);
      })
      return () => {
          socket.disconnect();
      };
  }, []);

  useEffect(() => {
    const events = new EventSource('http://localhost:5000/event-stream');
    events.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setSData(parsedData);
    };
  }, []);

  return (
    <div className="App">
      <div style={{margin: `200px`}}>
        <LineChart data={data} title={`Streaming with Websockets`}></LineChart>
      </div>
      <div style={{margin: `200px`}}>
        <LineChart  data={sData} title={`Streaming with SSE`}></LineChart>
      </div>
    </div>
  );

}

export default App;
