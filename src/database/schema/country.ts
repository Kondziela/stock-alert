import * as mongoose from 'mongoose';

var CountrySchema = new mongoose.Schema({
    country: String,
    active: Boolean
},{ collection: 'countries' });

export default mongoose.model('Country', CountrySchema);