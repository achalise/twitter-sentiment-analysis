import { Line } from 'react-chartjs-2';

export interface ChartData {
    records: Array<number>;
    labels: Array<string>;
}

const LineChart = ({labels, records}: ChartData) => {
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: '# of call translates',
                data: records,
                fill: false,
                backgroundColor: 'rgb(102, 255, 51',
                borderColor: 'rgba(102, 255, 51, 0.2)',
            },
            {
                label: '# of pause',
                data: records.map(i => i + Math.floor(Math.random()*3)),
                fill: false,
                backgroundColor: 'rgb(70, 70, 71)',
                borderColor: 'rgba(70, 70, 71, 0.2)',
            },
            {
                label: '# of other metrics',
                data: records.map(i => i + Math.floor(Math.random()*2)),
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.3)',
            },
        ],
    };
    
    const options = {
        animations: false,
        // animations: {
        //     tension: {
        //       duration: 1000,
        //       easing: 'linear',
        //       from: 1,
        //       to: 0,
        //       loop: true
        //     }
        //   },
          scales: {
            y: { // defining min and max so hiding the dataset does not change scale range
              min: 0,
              max: 15
            }
          }
    };

    return (

        <>
            <div className='header'>
                <h1 className='title'>Record stream</h1>
            </div>
            <Line data={chartData} type={'Line'} options={options} />
        </>
    );
}

export default LineChart;