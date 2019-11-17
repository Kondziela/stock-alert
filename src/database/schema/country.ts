import * as mongoose from 'mongoose';

var CountrySchema = new mongoose.Schema({
    country: String,
    companies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }]
},{ collection: 'countries' });

export default mongoose.model('Country', CountrySchema);