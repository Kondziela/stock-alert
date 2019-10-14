var Schema = require('mongoose').Schema,


var Event = new Schema({
	type: String,
	date: Date,
	company: { type: Schema.Types.ObjectId, ref: 'Company' }
});

module.exports = mongoose.model('Event', Event);