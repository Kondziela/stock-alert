import * as mongoose from 'mongoose';

const PriceSchema = new mongoose.Schema({
	open: Number,
	close: Number,
	low: Number,
	high: Number,
	volume: Number,
	date: Date,
	company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
},{ collection: 'prices' });

let Price;
try {
	Price = mongoose.model('Price');
} catch (e) {
	Price = mongoose.model('Price', PriceSchema);
}
export default Price;