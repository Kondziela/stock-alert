import * as mongoose from 'mongoose';

var HashtagSchema = new mongoose.Schema({
	hashtag: String,
	company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
},{ collection: 'hashtags' });

export default mongoose.model('Hashtag', HashtagSchema);