import * as mongoose from 'mongoose';

var ActivitySchema = new mongoose.Schema({
	type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ActivityType' },
	event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
	price_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Price' }
},{ collection: 'activities' });

export default mongoose.model('Activity', ActivitySchema);