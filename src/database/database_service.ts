import * as mongoose from 'mongoose';
require('./schema/company');
import Country from './schema/country';
import Company from './schema/company';
import Price from './schema/Price';

export class DatabaseService {

	private getDBUri(): string { 
		return `mongodb+srv://${process.env.mongodb_user}:${process.env.mongodb_password}` +
			`@cluster0-iyhzw.mongodb.net/cheeki-breeki?retryWrites=true&w=majority`

			
	}

	public init(): void {
		mongoose.connect(this.getDBUri(), { useUnifiedTopology: true, useNewUrlParser: true });
		mongoose.Promise = global.Promise;
	}

	public close(): void {
		mongoose.connection.close();
	}

	public findByCountry(country: string, callback: any): void {
		Country.findOne({"country": country}, (err, dbCountry) => {
			Company.find({"country": dbCountry}, (err, companies) => {
				console.log("Company by country: ", companies['name']);
				if (!err) {
					callback.call(this, companies);
				} else {
					console.log("Database connection error", err);
				}
			});
			
		})
	}

	public findActiveCompanies(callback: Function): void {
		Country.find({}, (err, countries) => {
			countries.filter(o => o.active).forEach(country => {
				Company.find({country: country}, (err, companies) => {
					if (!err) {
						callback.call(this, companies);
					} else {
						console.error('Error during looking for active companies');
					}
				});
			});
		});
	}

	public findPricesForCompanyAfterDate(company: Object, date: Date, callback: Function): void {
		Price.find({"date": {"$gte": date}, company: company }, null, {"sort": {"date": -1}}, (err, prices) => {
			if (!err) {
				callback.call(this, prices);
			} else {
				console.error('Error during looking for prices');
			}
		});
	}
}