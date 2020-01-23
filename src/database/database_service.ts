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
import {Op, fn, col} from "sequelize";

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

	public findPricesForCompanyBetweenDate(company: Company, startDate: Date, endDate: Date): Promise<Array<Price>> {
		return Price.findAll({
			where: {
				date: {
					[Op.gte]: startDate,
					[Op.lte]: endDate
				},
				company_id: company.id
			},
			order: [
				['date', 'DESC']
			]
		});
	}

	public findActivitiesByDate(date: Date): Promise<Array<Activity>> {
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

	public findMinDateOfEvent(company: Company): any {
		return Event.findAll({
            attributes: [[fn('MIN', col('created_date')), 'minDate']],
			include: [{
            	model: Company,
				where: {
            		name: company.name
				}
			}]
		})
	}

	public findHashtagsWithCompany(): Promise<Array<Hashtag>> {
		return Hashtag.findAll({
			where: {
				type: TwitterType.HASHTAG
			},
			include: [{
				model: Company
			}]
		});
	}

	public processTweetAndInformIfNotExist(tweetBuff: Object): Promise<void> {
		console.log(tweetBuff);
	    return new Promise<void>( (resolve, reject) => {
            TweetBuff.findOne({
				where: {
					tweet_id: {
						[Op.eq]: tweetBuff['tweet_id']
					},
					date: {
						[Op.eq]: new Date(tweetBuff['date'])
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
