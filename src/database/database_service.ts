import * as mongoose from 'mongoose';
require('./schema/company');
import Country from './schema/country';
import Company from './schema/company';
import Price from './schema/Price';
import Event from './schema/event';
import Activity from './schema/activity';

export class DatabaseService {

	private getDBUri(): string { 
		return `mongodb+srv://${process.env.mongodb_user}:${process.env.mongodb_password}` +
			`@cluster0-iyhzw.mongodb.net/cheeki-breeki?retryWrites=true&w=majority`
	}

	public init(): void {
		mongoose.connect(this.getDBUri(), { useUnifiedTopology: true, useNewUrlParser: true })
		.then( () => console.log("Database connected successfully"))
		.catch(err => console.error(`Error during initialize database ${err}`));
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

	public findActiveCompanies(): Promise<Array<Object>> {
		return Country.find({}).then( countries => {
			let activeCountries = countries.filter(o => o.active);
			return Company.find({country: {$in: activeCountries}}).populate('country').exec();
		}).catch( err => {
			console.error(err);
		});
	}

	public findPricesForCompanyAfterDate(company: Object, date: Date): Promise<Array<Object>> {
		return Price.find({"date": {"$gte": date}, company: company }, null, {"sort": {"date": -1}});
	}

	public findEventsByDate(date: Date): Promise<Array<Object>> {
		return Event.find({date: date}).exec();
	}

	public findActivityByEvent(event: Object): Promise<Array<Object>> {
		return Activity.find({event: event}).populate({
			path: 'event',
			populate: {path: 'company'}
		}).exec();
	}
}