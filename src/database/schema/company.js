var mongoose = require('mongoose');

var Company = new mongoose.Schema({
	country: String,
	code: String,
	name: String
});

module.exports = mongoose.model('Company', Company);