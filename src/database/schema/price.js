var Schema = require('mongoose').Schema,


var Price = new Schema({
	open: Number,
	close: Number,
	min: Number,
	max: Number,
	volume: Number,
	date: Date,
	company: { type: Schema.Types.ObjectId, ref: 'Company' }
});

module.exports = mongoose.model('Price', Price);