import * as Twit from 'twit';
import {Util} from "../utils/util";

export class TwitterSender {

    private config = {
        consumer_key: 'R4Cgv4Voxi46YVjKxXni5ielH',
        consumer_secret: '2BvH0p9LADXGguz3g3yaoWcRiZtbCSi9RAaJzAhoAdQZSABN5T',
        access_token: '861963361302581248-5oPq0YPjooUTzGypSGiax2g84iFk2sj',
        access_token_secret: '8ydygeHzy2HCQJYQ2vhVTlpnl6fHABKvuY5BQbGblYkB0'
    };

    private client: Twit;
    private util: Util;

    constructor() {
        this.util = new Util();
        this.client = new Twit(this.config);
    }

    // TODO[AKO]: repair fetching of twits
    public search(searchConfig: Object): Promise<any> {
        searchConfig['count'] = 2;
        console.log(`Twitter search config: ${searchConfig['max_id']}`);

        return new Promise<Object>( (resolve) => {
            this.client.get('search/tweets', searchConfig, (error, tweets) => {
                if (tweets['statuses'].length) {
                    let convertedTweets = this.convertTweets(tweets),
                        isToday = this.util.isDateToday(this.getLastDate(convertedTweets));

                    console.log(`Find tweets, will call another: ${isToday}`);
                    if (isToday) {
                        let nextId = this.decreaseByOne(this.getLastId(convertedTweets));
                        console.log(convertedTweets, 'Next', nextId);
                        this.search(Object.assign({max_id: nextId}, searchConfig)).then( newTweets => {
                            resolve(convertedTweets.concat(newTweets));
                        });
                    } else {
                        resolve(convertedTweets.filter(t => this.util.isDateToday(t['date'])));
                    }
                } else resolve([]);
            });
        });
    }
    private getNextIdFromTweets(tweets: Object): String {
        let map = {},
            nextResultsURL = tweets['search_metadata']['next_results'];
        nextResultsURL.substring(1).split('&').forEach( pair => {
            let splitPair = pair.split('=');
            map[splitPair[0]] = splitPair[1];
        });
        return map['max_id'];
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
        return tweets['statuses'].map( tweet => {return {
            date: new Date(tweet['created_at']),
            text: tweet['text'],
            id: tweet['id_str']
        }});
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

new TwitterSender().search({ q: '#cdr', lang: 'en'}).then( tweets => {
    console.log(tweets);
});