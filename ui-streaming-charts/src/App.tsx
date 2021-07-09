import React, { useEffect, useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';
import LineChart, { ChartData } from './charts/LineChart';

function App() {
  const [data, setData] = useState<ChartData>({labels: [] , records: []});

  useEffect(() => {
      const socket = io('http://localhost:5000');
      socket.on('channel_two', (chartData: ChartData) => {
        console.log(`The metrics`, chartData);
        setData(chartData);

      })
      return () => {
          socket.disconnect();
      };
  }, []);

  return (
    <div className="App">
      <div style={{margin: `200px`}}>
        <LineChart labels={data.labels} records={data.records}></LineChart>
      </div>
    </div>
  );

}

export default App;
