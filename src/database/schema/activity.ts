import {AbstractSchema} from "./abstract_schema";
import {AbstractQuery} from "./abstract_query";
import * as mongoose from 'mongoose';


// export class Activity extends AbstractSchema {
//
// 	protected static schema = {
// 		type: {
// 			type: String,
// 			required: true
// 		},
// 		event: {
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref: 'Event',
// 			required: true
// 		},
// 		price: {
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref: 'Price',
// 			required: true
// 		}
// 	}
// }
//
var ActivitySchema = new mongoose.Schema({},{ collection: 'activities' });
//
export default mongoose.model('Activity', ActivitySchema);