import Company from './models/company';
import Price from './models/price';
import Event from './models/event';
import Activity from './models/activity';
import Hashtag from './models/hashtag';
import Tweet from './models/tweet';
import TweetBuff from './models/tweet_buff';
import { TwitterType } from './twitter_type';
import {Sequelize} from "sequelize-typescript";
import { SequelizeConnection } from './sequelize_connection';
import Country from './models/country';
import {Op} from "sequelize";

export class DatabaseService {

	private sequelizeConnection: SequelizeConnection;

	constructor() {
		this.sequelizeConnection = new SequelizeConnection();
	}

	public init(): Promise<Sequelize> {
		return this.sequelizeConnection.getConnection();
	} 

	public close(): Promise<void> {
		return this.sequelizeConnection.close();
	}

	public findActiveCompanies(): Promise<Array<Company>> {
		return Company.findAll({
			include: [{
				model: Country,
				where: {
					active: true
				}
			}]
		});
	}

	public findAllActiveCountries(): Promise<Array<Country>> {
		return Country.findAll({
			where: {
                active: true
            }
		});
	}

	public findPricesForCompanyAfterDate(company: Company, date: Date): Promise<Array<Price>> {
		return Price.findAll({
			where: {
				date: {
					[Op.gte]: date
				},
				company_id: company.id
			},
			order: [
				['date', 'DESC']
			]
		});
	}

	public findActivitiesByDate(date: Date): Promise<Array<Activity>> {
		console.log('Servus', date);
		return Activity.findAll({
			include: [{
				model: Event,
				where: {
					created_date: {
						[Op.eq]: date
					}
				},
				include: [{
					model: Company
				}]
			}]
		})
	}

	public findHashtagsWithCompany(): Promise<Array<Hashtag>> {
		return Hashtag.findAll({
			where: {
				type: TwitterType.HASHTAG
			}
		});
	}

	public processTweetAndInformIfNotExist(tweetBuff: Object): Promise<void> {
	    return new Promise<void>( (resolve, reject) => {
            TweetBuff.findOne({
				where: {
					tweet_id: tweetBuff['id'],
					date: {
						[Op.eq]: tweetBuff['date']
					}
				}
			}).then((data) => {
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
	
	public findTweetAggregateForCompanyAndDate(company: Object, date: Date): Promise<Tweet> {
		return Tweet.findOne({
			where: {
				company_id: company['id'],
				date: date.toString()
			}
		});
	}

	public deleteTweetsBuffOlderThat(lastDate: Date): Promise<void> {
		return TweetBuff.destroy({
			where: {
				date: {
					[Op.lt]: lastDate
				}
			}
		});
	}
}
