import * as mongoose from 'mongoose';

var CompanySchema = new mongoose.Schema({
	country: String,
	code: String,
	name: String
});

export default mongoose.model('Company', CompanySchema);