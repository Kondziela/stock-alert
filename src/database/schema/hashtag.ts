import * as mongoose from 'mongoose';
import { TwitterType } from '../twitter_type';

var HashtagSchema = new mongoose.Schema({
	hashtag: String,
	type: {
		type: String,
		enum: Object.keys(TwitterType)
	},
	company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
},{ collection: 'hashtags' });

export default mongoose.model('Hashtag', HashtagSchema);