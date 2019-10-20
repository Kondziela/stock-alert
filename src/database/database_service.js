const 	mongoose = require('mongoose'),
		User = require('./schema/company.js');



let getDBUri = () => `mongodb+srv://${process.env.mongodb_user}:${process.env.mongodb_password}@cluster0-iyhzw.mongodb.net/test?retryWrites=true&w=majority`,
	init = () => {
		mongoose.connect(getDBUri(), { useCreateIndex: true, useNewUrlParser: true });
		mongoose.Promise = global.Promise;
	},
	close = () => {
		mongoose.connection.close();
	},

	findByCountry = (country, callback) => {
	User.find({country: country}, (err, docs) => {
		if (!err) {
			callback.call(this, docs);
		} else {
			console.log("Database connection error");
		}
	});
}

module.exports = {
    User,
    findByCountry,
    init, 
    close
};