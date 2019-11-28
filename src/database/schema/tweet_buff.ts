import * as mongoose from 'mongoose';

var TweetBuffSchema = new mongoose.Schema({
    date: Date,
    id: Number
},{ collection: 'tweets_buff' });

export default mongoose.model('TweetBuff', TweetBuffSchema );