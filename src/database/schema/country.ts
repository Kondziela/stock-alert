import * as mongoose from 'mongoose';

var CountrySchema = new mongoose.Schema({
    country: String
},{ collection: 'countries' });

export default mongoose.model('Country', CountrySchema);