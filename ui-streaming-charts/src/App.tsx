import React, { useEffect, useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';
import LineChart, { ChartData } from './charts/LineChart';

function App() {
  const [data, setData] = useState<ChartData>({labels: [] , records: []});
  const [sData, setSData] = useState<ChartData>({labels: [] , records: []});

  useEffect(() => {
      const socket = io('http://localhost:5000');
      socket.on('channel_two', (chartData: ChartData) => {
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
        <LineChart labels={data.labels} records={data.records} title={`Streaming with Websockets`}></LineChart>
      </div>
      <div style={{margin: `200px`}}>
        <LineChart labels={sData.labels} records={sData.records} title={`Streaming with SSE`}></LineChart>
      </div>
    </div>
  );

}

export default App;
