import * as mongoose from 'mongoose';
require('./schema/company');
import Country from './schema/country';
import Company from './schema/company';
import Price from './schema/price';
import Event from './schema/event';
import Activity from './schema/activity';
import Hashtag from './schema/hashtag';
import TweetBuff from './schema/tweet_buff';

export class DatabaseService {

	private getDBUri(): string { 
		return `mongodb+srv://${process.env.mongodb_user}:${process.env.mongodb_password}` +
			`@cluster0-iyhzw.mongodb.net/cheeki-breeki?retryWrites=true&w=majority`
	}

	public init(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			console.log('Initializing database...');
			mongoose.connect(this.getDBUri(), { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: true })
				.then( () => {
					console.log("Database connected successfully");
					mongoose.Promise = global.Promise;
					resolve();
				})
				.catch(err => {
					console.error(`Error during initialize database ${err}`);
					reject(err);
				});
		});
	}

	public close(): void {
		mongoose.connection.close();
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

	public findHashtagsWithCompany(): Promise<Array<Object>> {
		return Hashtag.find({}).populate('company').exec();
	}

	public processTweetAndInformIfNotExist(tweetBuff): Promise<void> {
	    return new Promise<void>( (resolve, reject) => {
            TweetBuff.findOne(tweetBuff).exec()
                .then((data) => {
                    if (data) {
                        console.log('Found in buff');
                        reject('Tweet exists in buff');
                    } else {
                        console.log('Didn\'t find in buff');
                        TweetBuff.create(tweetBuff);
                        return resolve();
                    }
                });
        });
    }
}