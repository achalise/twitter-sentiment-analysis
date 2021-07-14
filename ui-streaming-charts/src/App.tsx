import React, { useEffect, useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';
import LineChart, { ChartData } from './charts/LineChart';

function App() {
  const [data, setData] = useState<ChartData[]>([]);
  const [sData, setSData] = useState<ChartData[]>([]);
  const [sentimentData, setSentimentData] = useState<ChartData[]>([{labels: ['0'], records: [0]}, {labels: ['0'], records: [0]}, {labels: ['0'], records: [0]}]);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('channel_two', (chartData: ChartData[]) => {
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

  useEffect(() => {
    const events = new EventSource('http://localhost:5000/sentiment-stream');
    events.onmessage = (event) => {
      const parsedData = JSON.parse(event.data) as Sentiment;
      let currentRecordCount = sentimentData[0].records.length;
      let nextLabel = `${Number.parseInt(sentimentData[0].labels[currentRecordCount - 1]) + 1}`;
      switch (parsedData.category) {
        case 'Positive': {
          let netxtRecord = sentimentData[0].records[currentRecordCount - 1] + 1;
          sentimentData[0].records.push(netxtRecord);
          sentimentData[0].labels.push(nextLabel);

          netxtRecord = sentimentData[1].records[currentRecordCount - 1];
          sentimentData[1].records.push(netxtRecord);
          sentimentData[1].labels.push(nextLabel);

          netxtRecord = sentimentData[2].records[currentRecordCount - 1];
          sentimentData[2].records.push(netxtRecord);
          sentimentData[2].labels.push(nextLabel);
          break;
        }
        case 'Negative': {
          let netxtRecord = sentimentData[1].records[currentRecordCount - 1] + 1;
          sentimentData[1].records.push(netxtRecord);
          sentimentData[1].labels.push(nextLabel);

          netxtRecord = sentimentData[0].records[currentRecordCount - 1];
          sentimentData[0].records.push(netxtRecord);
          sentimentData[0].labels.push(nextLabel);

          netxtRecord = sentimentData[2].records[currentRecordCount - 1];
          sentimentData[2].records.push(netxtRecord);
          sentimentData[2].labels.push(nextLabel);
          break;
        }
        case 'Neutral': {
          let netxtRecord = sentimentData[2].records[currentRecordCount - 1] + 1;
          sentimentData[2].records.push(netxtRecord);
          sentimentData[2].labels.push(nextLabel);

          netxtRecord = sentimentData[1].records[currentRecordCount - 1];
          sentimentData[1].records.push(netxtRecord);
          sentimentData[1].labels.push(nextLabel);

          netxtRecord = sentimentData[0].records[currentRecordCount - 1];
          sentimentData[0].records.push(netxtRecord);
          sentimentData[0].labels.push(nextLabel);
        }
      }
      setSentimentData([...sentimentData]);
    };
  }, []);

  return (
    <div className="App">
      <div style={{ margin: `200px` }}>
        <LineChart data={data} title={`Streaming with Websockets`}></LineChart>
      </div>
      <div style={{ margin: `200px` }}>
        <LineChart data={sData} title={`Streaming with SSE`}></LineChart>
      </div>
      <div style={{ margin: `200px` }}>
        <LineChart data={sentimentData} title={`Streaming twitter sentiment`} legends={[`Positive`, `Negative`, `Neutral`]}></LineChart>
      </div>
    </div>
  );

}

interface Sentiment {
  message: string;
  score: number;
  category: 'Positive' | 'Negative' | 'Neutral'

}

export default App;
