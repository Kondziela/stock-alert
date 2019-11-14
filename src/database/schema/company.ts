import * as mongoose from 'mongoose';

var CompanySchema = new mongoose.Schema({
	country: String,
	code: String,
	name: String
});

const CompanyModel = mongoose.model('Company', CompanySchema);

export default CompanyModel;