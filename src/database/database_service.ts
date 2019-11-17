import * as mongoose from 'mongoose';
require('./schema/company');
import Country from './schema/country';
import Company from './schema/company';

export class DatabaseService {

	private getDBUri(): string { 
		return `mongodb+srv://${process.env.mongodb_user}:${process.env.mongodb_password}` +
			`@cluster0-iyhzw.mongodb.net/cheeki-breeki?retryWrites=true&w=majority`

			
	}

	public init(): void {
		console.log(this.getDBUri());
		mongoose.connect(this.getDBUri(), { useUnifiedTopology: true, useNewUrlParser: true });
		mongoose.Promise = global.Promise;
	}

	public close(): void {
		mongoose.connection.close();
	}

	public findByCountry(country: string, callback: any): void {
		Country.findOne({"country": country}).exec((err, dbCountry) => {
			Company.find({"country": dbCountry}).exec((err, companies) => {
				console.log("Company by country: ", companies);
				if (!err) {
					callback.call(this, companies);
				} else {
					console.log("Database connection error", err);
				}
			});
			
		})
	}
}