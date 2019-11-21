import * as mongoose from 'mongoose';

var TweetSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    date: Date,
    total: Number,
    positive: Number,
    negative: Number,
    neutral: Number
},{ collection: 'tweets' });

export default mongoose.model('Tweet', TweetSchema);