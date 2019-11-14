import * as mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
	type: String,
	date: Date,
	company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
});

const EventModel = mongoose.model('Event', EventSchema);

export default EventModel;