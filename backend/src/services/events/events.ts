let events = [];

export const nextChartData = (): EventData[] => {
    if (events.length === 0) {
        initialise();
        return [...events];
    }
    events.map((e: EventData) => {
        let labels = e.labels;
        let records = e.records;
        let nextLabel = Number.parseInt(labels[labels.length - 1]) + 1;
        labels.push(`${nextLabel}`);
        e.labels = labels.slice(1);
        let nextRecord = Math.floor(Math.random() * 10);
        records.push(nextRecord);
        e.records = records.slice(1);
    })

    return [...events];
}

const initialise = () => {

    [`callTranslate`, `pause`, `otherEvents`].map(name => {
        let labels = [];
        let records = [];
        [...Array(50).keys()].map((val, index) => {
            labels.push(`${index}`);
            records.push(Math.floor(Math.random() * 10));
        })
        events.push({ name, labels, records });
    })
}

export interface EventData {
    name: string;
    labels: Array<string>;
    records: Array<number>;
}
