import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { io } from 'socket.io-client';
import LineChart, { ChartData } from './charts/LineChart';
import { nextChartData } from './service/message-source';

function App() {
  const [isPaused, setPause] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [data, setData] = useState<ChartData>({labels: [] , records: []});

  useEffect(() => {
      const socket = io('http://localhost:5000');
      socket.on('channel_one', (e: any) => {
        setMessages([...messages, e])
      })
      socket.on('channel_two', (e: any) => {
        console.log(`The metrics`, e);
      })
      return () => {
          socket.disconnect();
      };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const {labels, records} = nextChartData();
      console.log(`newRecords ${records} and new labels ${labels}`);
      setData({labels: [...labels], records: [...records]});
    }, 1000);
    return () => {
      clearInterval(interval);
    }
  }, []);

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
