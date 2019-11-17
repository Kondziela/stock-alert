import * as mongoose from 'mongoose';

var CompanySchema = new mongoose.Schema({
	country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
	code: String,
	name: String
},{ collection: 'companies' });

export default mongoose.model('Company', CompanySchema);