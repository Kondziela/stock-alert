import * as mongoose from 'mongoose';

var EventSchema = new mongoose.Schema({
	company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
	date: Date,
	type: String
},{ collection: 'events' });

export default mongoose.model('Event', EventSchema);