import * as Twit from 'twit';
import {Util} from "../utils/util";
import * as Sentiment from 'sentiment';

export class TwitterSender {

    private client: Twit;
    private util: Util;
    private sentiment: Sentiment;
    private companyMap: Object;

    constructor() {
        this.util = new Util();
        this.sentiment = new Sentiment();
        this.companyMap = {
            Facebook: ['facebook'],
            Apple: ['apple', 'iphone'],
            Amazon: ['amazon', 'aws']
        };
        this.client = new Twit({
            consumer_key: process.env.consumer_key,
            consumer_secret: process.env.consumer_secret,
            access_token: process.env.access_token,
            access_token_secret: process.env.access_token_secret
        });
    }

    public createStream() {
        let stream = this.client.stream('statuses/filter', { 
            track: ['#facebook', '#apple', '#amazon', '#AWS'], 
            language: 'en', 
            tweet_mode: 'extended'
        }),
            me = this;

        console.log('Creating stream...');
        stream.on('tweet', function (originalTweet) {
            let tweet = me.convertTweet(originalTweet);
            console.log(tweet);
            let companies = me.findCompanies([...tweet['hashtags']]);
            console.log('Companies: ', companies);
            let analyze = me.sentiment.analyze(tweet['text']);
            console.log('Analyze of sentiment', analyze['score']);
        });
        stream.on('connect', function (requst) {
             console.log('Connect');
        });
        stream.on('reconnect', function (request, response, connectInterval) {
             console.log('Reconnect');
        });
    }

    private findCompanies(hashtagList): Array<String> {
        let me = this;
        return Object.keys(this.companyMap)
            .filter( (company) => {
                return hashtagList.some(hashtag => this.companyMap[company].includes(hashtag.toLowerCase()))
            });
    }

    private convertTweet(tweet: Object): {date: Date, text: String, id: number, hashtags: Array<String>, user_mentions: Array<String>} {
        let extendedTweet = tweet['retweeted_status'] ? tweet['retweeted_status']['extended_tweet'] : tweet['extended_tweet'],
            text = tweet['truncated'] ? extendedTweet['full_text'] : tweet['text'];

        if (!extendedTweet && tweet['truncated'] ) {
            console.log(tweet);
            throw new Error('Unhandle tweet');
        }

        return {
            date: new Date(tweet['created_at']),
            text: text,
            id: tweet['id_str'],
            hashtags: tweet['entities']['hashtags'].map( hashtag => hashtag['text']),
            user_mentions: tweet['entities']['user_mentions'].map( user => user['name'])
        }
    }

    // SEARCH FUNCTION
    // NOT USE IN APPLICATION

    public search(searchConfig: Object): Promise<any> {
        searchConfig['count'] = 100;

        return new Promise<Object>( (resolve) => {
            this.client.get('search/tweets', searchConfig, (error, tweets) => {
                if (tweets['statuses'].length) {
                    let convertedTweets = this.convertTweets(tweets),
                        isToday = this.util.isDateToday(this.getLastDate(convertedTweets));

                    console.log(`Find tweets, will call another: ${isToday}`);
                    if (isToday) {
                        let nextId = this.decreaseByOne(this.getLastId(convertedTweets));
                        console.log(convertedTweets, 'Next', nextId);
                        searchConfig['max_id'] = nextId;
                        this.search(searchConfig).then( newTweets => {
                            resolve(convertedTweets.concat(newTweets));
                        });
                    } else {
                        resolve(convertedTweets.filter(t => this.util.isDateToday(t['date'])));
                    }
                } else resolve([]);
            });
        });
    }

    private getLastId(tweets: Array<Object>): String {
        return this.getLastTweet(tweets)['id'];
    }

    private getLastDate(tweets: Array<Object>): Date {
        return this.getLastTweet(tweets)['date'];
    }

    private getLastTweet(tweets: Array<Object>): Object {
        return tweets.reduce( (tweet1, tweet2) => {
            if (new Date(tweet1['date']).getTime() < new Date(tweet2['date']).getTime()) {
                return tweet1;
            } else {
                return tweet2;
            }
        });
    }

    private convertTweets(tweets: Object): Array<Object> {
        return tweets['statuses'].map( tweet => this.convertTweet(tweet));
    }

    private decreaseByOne(id: String): String {
        let rest = 1,
            digitals = id.split('');

        for (let i = id.length - 1; i>-1; i--) {
            let digit = parseInt(digitals[i]) - rest;
            if (digit < 0) {
                rest = 1;
                digit = 9;
            } else {
                rest = 0;
            }
            digitals[i] = digit.toString();
        }
        return digitals.join('');
    }
}