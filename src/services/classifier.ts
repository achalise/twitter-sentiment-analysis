import * as tf from '@tensorflow/tfjs-node'
import fetch from 'node-fetch';

global.fetch = require('node-fetch');

const urls = {
    model: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json',
    metadata: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json'
};
let model, metadata;

const SentimentThreshold = {
    Positive: 0.66,
    Neutral: 0.33,
    Negative: 0
}
const PAD_INDEX = 0;
const OOV_INDEX = 2;

async function loadModel() {
    try {
        model = await tf.loadLayersModel(urls.model);
        return model;
    } catch (err) {
        console.log(err);
    }
}
 
async function loadMetadata() {
    try {
        const metadataJson = await fetch(urls.metadata);
        metadata = await metadataJson.json();
        return metadata;
    } catch (err) {
        console.log(err);
    }
}
async function getSentimentScore(rawText) {
    let text = rawText.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
    if(!model) { await loadModel(); }
    if(!metadata) { await loadMetadata(); }
    const inputText = text.trim().toLowerCase().replace(/(\.|\,|\!,|\#,|\@)/g, '').split(' ');
    console.log(inputText);
    // Convert the words to a sequence of word indices.
    const sequence = inputText.map(word => {
      let wordIndex = metadata.word_index[word] + metadata.index_from;
      if (isNaN(wordIndex) || wordIndex > metadata.vocabulary_size) {
        wordIndex = OOV_INDEX;
      }
      return wordIndex;
    });
    // Perform truncation and padding.
    const paddedSequence = padSequences([sequence], metadata.max_len);
    const input = tf.tensor2d(paddedSequence, [1, metadata.max_len]);
 
    const predictOut = model.predict(input);
    const score = predictOut.dataSync()[0];
    let sentiment = 'Neutral';
    if(score > 0.65) {
        sentiment = 'Positive'
    } else if(score < 0.33) {
        sentiment = 'Negative';
    }
    console.log(`score for ${rawText} is ${score} ${sentiment}`);
    predictOut.dispose();
 
    return score;
}

function padSequences(sequences, maxLen, padding = 'pre', truncating = 'pre', value = PAD_INDEX) {
    return sequences.map(seq => {
      if (seq.length > maxLen) {
        if (truncating === 'pre') {
          seq.splice(0, seq.length - maxLen);
        } else {
          seq.splice(maxLen, seq.length - maxLen);
        }
      }
  
      if (seq.length < maxLen) {
        const pad = [];
        for (let i = 0; i < maxLen - seq.length; ++i) {
          pad.push(value);
        }
        if (padding === 'pre') {
          seq = pad.concat(seq);
        } else {
          seq = seq.concat(pad);
        }
      }
  
      return seq;
    });
  }
export {
    getSentimentScore
} 