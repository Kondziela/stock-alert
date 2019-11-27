import * as mongoose from 'mongoose';
import {ActivityType} from "../activity_type";

var ActivitySchema = new mongoose.Schema({
	type: {
		type: String,
		enum: Object.keys(ActivityType),
		required: true
	},
	event: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event',
		required: true
	},
	price: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Price',
		required: true
	}
},{ collection: 'activities' });

export default mongoose.model('Activity', ActivitySchema);