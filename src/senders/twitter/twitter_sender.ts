import * as Twit from 'twit';
import {Util} from "../../utils/util";
import * as Sentiment from 'sentiment';
import {TwitterSuit} from "./twitter_suit";

export class TwitterSender extends TwitterSuit {

    private client: Twit;
    private util: Util;
    private sentiment: Sentiment;

    constructor() {
        super();
        this.util = new Util();
        this.sentiment = new Sentiment();
        this.client = new Twit({
            consumer_key: process.env.consumer_key,
            consumer_secret: process.env.consumer_secret,
            access_token: process.env.access_token,
            access_token_secret: process.env.access_token_secret
        });
    }

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