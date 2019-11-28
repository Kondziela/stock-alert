export class TwitterSuit {

    protected convertTweet(tweet: Object): {date: Date, text: String, id: number, hashtags: Array<String>, user_mentions: Array<String>} {
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

}