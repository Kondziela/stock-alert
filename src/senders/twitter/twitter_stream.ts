import * as Twit from 'twit';
import * as Sentiment from 'sentiment';
import {TwitterSuit} from "./twitter_suit";
import {DatabaseService} from "../../database/database_service";

export class TwitterStream extends TwitterSuit {

    private client: Twit;
    private sentiment: Sentiment;
    private companyMap: Object;
    private database: DatabaseService;

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
    }

    public createStream(trackList: Array<String>): void {
        console.log(trackList);
        let stream = this.client.stream('statuses/filter', {
                track: trackList,
                language: 'en',
                tweet_mode: 'extended'
            }),
            me = this;

        console.log('Tweeter Stream created');

        stream.on('tweet', function (originalTweet) {
            let tweet = me.convertTweet(originalTweet);
            console.log(tweet);
            let companies = me.findCompanies([...tweet['hashtags']]);
            console.log('Companies: ', companies);
            if (companies.length) {
                me.database.processTweetAndInformIfNotExist({id: tweet['id'], date: tweet['date']})
                    .then(() => {
                        let analyze = me.sentiment.analyze(tweet['text']);
                        console.log('Analyze of sentiment', analyze['score']);
                    }).catch(err => console.log(err));
            }
        });

        stream.on('connect', function (requst) {
            console.log('Connected with Twitter');
        });
        stream.on('reconnect', function (request, response, connectInterval) {
            console.log('Reconnect with Twitter');
        });
    }

    private findCompanies(hashtagList): Array<String> {
        return Object.keys(this.companyMap)
            .filter( (company) => {
                return hashtagList.some(hashtag => this.companyMap[company].includes(hashtag.toLowerCase()))
            });
    }


}