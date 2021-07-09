import React, { useEffect, useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';
import LineChart, { ChartData } from './charts/LineChart';

function App() {
  const [isPaused, setPause] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [data, setData] = useState<ChartData>({labels: [] , records: []});

  useEffect(() => {
    //ws://localhost:3000/socket.io/?EIO=3&transport=websocket
      const socket = io('http://localhost:5000');
      socket.on('channel_one', (e: any) => {
        setMessages([...messages, e])
      })
      socket.on('channel_two', (chartData: ChartData) => {
        console.log(`The metrics`, chartData);
        setData(chartData);

      })
      return () => {
          socket.disconnect();
      };
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const {labels, records} = nextChartData();
  //     setData({labels: [...labels], records: [...records]});
  //   }, 1000);
  //   return () => {
  //     clearInterval(interval);
  //   }
  // }, []);

  return (
    <div className="App">
      <header className="App-header">
      <div>
          <button onClick={() => setPause(!isPaused)}>
              {isPaused ? "Resume" : "Pause"}
          </button>
          <LineChart labels={data.labels} records={data.records}></LineChart>
          {messages && messages.map((m:any) => {
        return (<p>{m}</p>)
      })}
      </div>
      </header>
      <LineChart labels={data.labels} records={data.records}></LineChart>
    </div>



  );

}

export default App;
