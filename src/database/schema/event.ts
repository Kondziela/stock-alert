import * as mongoose from 'mongoose';
import {EventType} from "../../bots/EventType";

var EventSchema = new mongoose.Schema({
	company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
	date: Date,
	type: {
		type: String,
		enum: Object.keys(EventType)
	}
},{ collection: 'events' });

export default mongoose.model('Event', EventSchema);