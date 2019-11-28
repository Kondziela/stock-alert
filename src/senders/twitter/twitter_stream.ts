import * as Twit from 'twit';
import * as Sentiment from 'sentiment';
import {TwitterSuit} from "./twitter_suit";
import {DatabaseService} from "../../database/database_service";
import Tweet from '../../database/schema/tweet';

export class TwitterStream extends TwitterSuit {

    private client: Twit;
    private sentiment: Sentiment;
    private companyMap: Object;
    private database: DatabaseService;
    private queue: Array<Object>;

    constructor(companyMap: Object) {
        super();
        this.sentiment = new Sentiment();
        this.database = new DatabaseService();
        this.client = new Twit({
            consumer_key: process.env.consumer_key,
            consumer_secret: process.env.consumer_secret,
            access_token: process.env.access_token,
            access_token_secret: process.env.access_token_secret
        });
        this.companyMap = companyMap;
        this.queue = new Array<Object>();
    }

    public createStream(trackList: Array<String>): void {
        let stream = this.client.stream('statuses/filter', {
                track: trackList,
                language: 'en',
                tweet_mode: 'extended'
            }),
            me = this;

        console.log('Tweeter Stream created');

        stream.on('tweet', (originalTweet) => me.queue.push(originalTweet));
        stream.on('connect', (requst) => console.log('Connected with Twitter'));
        stream.on('reconnect', (request, response, connectInterval) => console.log('Reconnect with Twitter'));

        // Start tweet processing
        this.handleQueue();
    }

    private handleQueue(): void {
        let tweet = this.queue.shift();
        console.log(`Size of Queue: ${this.queue.length}`);
        if (tweet) {
            this.handleTweet(tweet).then(() => this.handleQueue());
        } else {
            new Promise(resolve => setTimeout(resolve, 1000)).then(() => this.handleQueue());
        }
    }

    private handleTweet(originalTweet: Object): Promise<void> {
        return new Promise<void>( resolve => {
            let tweet = this.convertTweet(originalTweet);
                console.log(`Received tweet with ID: ${tweet['id']}`);
                let companies = this.findCompanies([...tweet['hashtags']]);
                
            if (companies.length) {
                console.log(`Tweet matchs with ${companies.length} companies`);
                this.database.processTweetAndInformIfNotExist({id: tweet['id'], date: tweet['date']})
                    .then(() => {
                        let analyze = this.sentiment.analyze(tweet['text']),
                            tweetDate = new Date(tweet['date'].toISOString().substr(0, 10));
                        console.log(`Sentiment value: ${analyze['score']}`);
                        
                        companies.forEach(company => {
                            this.database.findTweetAggregateForCompanyAndDate(company, tweetDate)
                                .then(aggregate => {
                                    this.processUpsertOfTweetAggregate(aggregate, company, tweetDate, analyze)
                                    .then(() => {
                                        console.log(`Created aggregate`);
                                        resolve();
                                    });
                                });
                        });
                    }).catch(err => console.log(err));
            } else {
                console.log(`Tweet doesn't related to watched companies`);
                resolve();
            }
        })
    }

    private getFilterValues(tweet: Object): Object {
        return {
            company: tweet['company'],
            date: tweet['date']
        }
    }

    private processSentiment(tweet: Object, sentiment: number): Object {
        if (sentiment > 0) {
            tweet['positive']++;
        } else if (sentiment < 0) {
            tweet['negative']++;
        } else {
            tweet['neutral']++;
        }
        tweet['total']++;
        return tweet;
    }

    private findCompanies(hashtagList): Array<Object> {
        return Object.keys(this.companyMap)
            .filter( (company) => {
                return hashtagList.some(hashtag => this.companyMap[company].includes(hashtag.toLowerCase()))
            }).map(company => JSON.parse(company));
    }

    private processUpsertOfTweetAggregate(aggregate, company, tweetDate, analyze): Promise<void> {
        console.log(`Found aggregate ${aggregate}`);
        if (!aggregate) {
            aggregate = {
                company: company,
                date: tweetDate,
                total: 0,
                positive: 0,
                negative: 0,
                neutral: 0
            };
        }
        return Tweet.findOneAndUpdate(
            this.getFilterValues(aggregate),
            this.processSentiment(aggregate, analyze['score']),
        {
            upsert: true,
            new: true
        }).exec();
    }
}
