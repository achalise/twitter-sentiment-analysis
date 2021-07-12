import { kafka } from "../../Config";
import { EventData, nextChartData } from './events';

const eventProducer = kafka.producer();
const eventTopic = "events";

const publishEvents = async (events: EventData[]) => {
    await eventProducer.connect();
    await eventProducer.send({
        topic: eventTopic,
        messages: [
            { value: JSON.stringify(events) },
        ],
    })
}

const consumeEvents = async (cb: (events: EventData) => void, groupId: string) => {
    const eventConsumer = kafka.consumer({ groupId: groupId })
    await eventConsumer.connect();
    await eventConsumer.subscribe({ topic: eventTopic, fromBeginning: false });
    eventConsumer.run({
        eachMessage: async ({topic, partition, message}) => {
            cb(JSON.parse(message.value.toString()));
        }
    });
    return async () => {
        await eventConsumer.disconnect();
    }
}

const initEventStream = (interval) => {
    const intervalRef = setInterval(() => {
        publishEvents(nextChartData());
    }, interval);

    return () => {
        clearInterval(intervalRef);
    }
}

export default {
    initEventStream, consumeEvents, publishEvents
}
