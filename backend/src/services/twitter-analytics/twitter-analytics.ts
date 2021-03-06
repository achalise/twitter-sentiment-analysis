import { kafka } from '../../Config';
import { getSentimentScore } from './classifier';


const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'group1' })


async function sendMessage(msg: string, topic = 'test-topic') {
    await producer.connect();
    await producer.send({
        topic: topic,
        messages: [
            { value: msg },
        ],
    })
}

async function subscribeToSentimentScore(cb, groupId) {
    const sentimentScoreConsumer = kafka.consumer({ groupId: groupId })
    await sentimentScoreConsumer.connect();
    await sentimentScoreConsumer.subscribe({topic: Topic.SENTIMENT_SCORE_TOPIC, fromBeginning: false});
    await sentimentScoreConsumer.run({
        eachMessage: async ({topic, partition, message}) => {
            cb(message.value.toString());
        }
    })

}

async function subscribe() {

    await consumer.connect();
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: false })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const score = await getSentimentScore(message.value.toString());
                let sentiment: SentimentType = 'Neutral';
                if(score > 0.65) {
                    sentiment = 'Positive'
                } else if(score < 0.33) {
                    sentiment = 'Negative';
                }
                const sentimentScore = {
                    message: message.value.toString(),
                    score: score,
                    category: sentiment
                } as SentimentScore;
                await sendMessage(JSON.stringify(sentimentScore), Topic.SENTIMENT_SCORE_TOPIC.toString());
                console.log(`Sentiment score:${sentimentScore}`, sentimentScore);
            } catch(e) {
                console.log(e);
            }

        },
    })
}


export default {
    sendMessage,
    subscribe,
    subscribeToSentimentScore
}

export interface SentimentScore {
    message: string;
    score: number;
    category: SentimentType

}

export type SentimentType = 'Positive' | 'Negative' | 'Neutral';

export enum Topic {
    TEST_TOPIC = 'test_-opic',
    SENTIMENT_SCORE_TOPIC = 'sentiment-score-topic'
}
