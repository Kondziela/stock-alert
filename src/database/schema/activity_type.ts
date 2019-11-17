import * as mongoose from 'mongoose';

var ActivityTypeSchema = new mongoose.Schema({
	type: String
},{ collection: 'activity_types' });

export default mongoose.model('ActivityType', ActivityTypeSchema);