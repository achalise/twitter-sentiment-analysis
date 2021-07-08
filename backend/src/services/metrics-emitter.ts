let records: Array<number> = [];
let labels: Array<string> = [];

export const nextChartData = () => {
    if(records.length === 0) {
        initialise();
        return {
            labels: [...labels],
            records: [...records]
        }
    }
    let nextLabel = Number.parseInt(labels[labels.length - 1]) + 1;
    labels.push(`${nextLabel}`);
    labels = labels.splice(1);
    let nextRecord = Math.floor(Math.random() * 10);
    records.push(nextRecord);
    records = records.splice(1);
    return {
        labels: [...labels],
        records: [...records]
    }
}

const initialise = () => {
    [...Array(100).keys()].map((val, index) => {
        labels.push(`${index}`);
        records.push(Math.floor(Math.random() * 10));
    })
}
