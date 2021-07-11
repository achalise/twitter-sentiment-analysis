import { Line } from 'react-chartjs-2';

export interface ChartData {
    records: Array<number>;
    labels: Array<string>;
    name?: string;
}

export interface LineChartInput {
    data: ChartData[];
    title?: string;
}

const LineChart = (lineChartInput: LineChartInput) => {
    const chartData = {
        labels: lineChartInput.data.length > 0 ? lineChartInput.data[0].labels: [],
        datasets: [
            {
                label: '# of call translates',
                data: lineChartInput.data.length > 0 ? lineChartInput.data[0].records: [],
                fill: false,
                lineTension: 1,
                backgroundColor: 'rgb(102, 255, 51',
                borderColor: 'rgba(102, 255, 51, 0.5)',
            },
            {
                label: '# of pause',
                data: lineChartInput.data.length > 0 ? lineChartInput.data[1].records: [],
                fill: false,
                lineTension: 0.8,
                backgroundColor: 'rgb(70, 70, 71)',
                borderColor: 'rgba(70, 70, 71, 0.2)',
            },
            {
                label: '# of other metrics',
                data: lineChartInput.data.length > 0 ? lineChartInput.data[2].records: [],
                fill: false,
                lineTension: 0.8,
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
                <h1 className='title'>{lineChartInput.title || `Line Graph`}</h1>
            </div>
            <Line data={chartData} type={'Line'} options={options} />
        </>
    );
}

export default LineChart;