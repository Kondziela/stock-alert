import * as Twit from 'twit';
import * as Sentiment from 'sentiment';
import {TwitterSuit} from "./twitter_suit";
import {DatabaseService} from "../../database/database_service";
import Tweet from '../../database/models/tweet';
import {Logger} from "../../utils/logger";

export class TwitterStream extends TwitterSuit {

    private client: Twit;
    private sentiment: Sentiment;
    private companyMap: Object;
    private database: DatabaseService;
    private queue: Array<Object>;
    private logger: Logger;

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
        this.logger = new Logger();
    }

    public createStream(trackList: Array<String>): void {
        let stream = this.client.stream('statuses/filter', {
                track: trackList,
                language: 'en',
                tweet_mode: 'extended'
            }),
            me = this;

        console.log('Tweeter Stream created');

        stream.on('tweet', (originalTweet) => {
            me.logger.logMemory('Tweet receive');
            me.queue.push(originalTweet)
        });
        stream.on('connect', () => {
            me.logger.log('Connected with Twitter');
            me.logger.logMemory('Twitter connect');
            console.log('Connected with Twitter')
        });
        stream.on('reconnect', () => {
            me.logger.log('Reconnected with Twitter');
            me.logger.logMemory('Twitter reconnect');
            console.log('Reconnect with Twitter')
        });
        stream.on('limit', () => {
            me.logger.log('Twitter limit');
            me.logger.logMemory('Twitter limit');
            console.log('Twitter limit')
        });
        stream.on('disconnect', () => {
            me.logger.log('Twitter disconnect');
            me.logger.logMemory('Twitter disconnect');
            console.log('Twitter disconnect')
        });

        // Start tweet processing
        this.handleQueue();
    }

    private handleQueue(): void {
        let tweet = this.queue.shift();
        console.log(`Size of Queue: ${this.queue.length} at ${new Date().toISOString()}`);
        if (tweet) {
            this.handleTweet(tweet)
                .then(() => this.handleQueue())
                .catch(err => this.logger.log(err));
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
                this.database.processTweetAndInformIfNotExist({tweet_id: tweet['id'], date: tweet['date']})
                    .then(() => {
                        let analyze = this.sentiment.analyze(tweet['text']),
                            tweetDate = new Date(tweet['date'].toISOString().substr(0, 10));
                        console.log(`Sentiment value: ${analyze['score']}`);
                        
                        companies.forEach(company => {
                            this.processUpsertOfTweetAggregate(company, tweetDate, analyze)
                            .then(() => {
                                console.log(`Created aggregate`);
                                resolve();
                            });
                        });
                    }).catch(err => console.log(err));
            } else {
                console.log(`Tweet doesn't related to watched companies`);
                resolve();
            }
        })
    }

    private processSentiment(tweet: Tweet, sentiment: number): Tweet {
        if (sentiment > 0) {
            tweet['positive']++;
        } else if (sentiment < 0) {
            tweet['negative']++;
        } else {
            tweet['neutral']++;
        }
        tweet['total']++;
        console.log(tweet['dataValues']);
        return tweet;
    }

    private findCompanies(hashtagList): Array<Object> {
        return Object.keys(this.companyMap)
            .filter( (company) => {
                return hashtagList.some(hashtag => this.companyMap[company].includes(hashtag.toLowerCase()))
            }).map(company => JSON.parse(company));
    }

    private processUpsertOfTweetAggregate(company, tweetDate, analyze): Promise<void> {
        return new Promise<void>(resolve => 
            Tweet.findOrCreate({
                where: {
                    company_id: company['id'],
                    date: tweetDate
                },
                defaults: {
                    company_id: company['id'],
                    date: tweetDate,
                    total: 0,
                    positive: 0,
                    negative: 0,
                    neutral: 0
                }
            }).then(tweet => {
                let tweetObject = this.processSentiment(tweet[0], analyze['score']);
                console.log({
                    total: tweetObject.total,
                    positive: tweetObject.positive,
                    negative: tweetObject.negative,
                    neutral: tweetObject.neutral
                });
                Tweet.update({
                    total: tweetObject.total,
                    positive: tweetObject.positive,
                    negative: tweetObject.negative,
                    neutral: tweetObject.neutral
                },{
                    where: {
                        id: tweetObject.id
                    }
                }).then(() => resolve()).catch(err => console.error(err));
            })
        );
    }
}
