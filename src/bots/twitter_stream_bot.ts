import {TwitterStream} from "../senders/twitter/twitter_stream";
import {DatabaseService} from "../database/database_service";

export class TwitterStreamBot {

    private database: DatabaseService;
    private twitterStream: TwitterStream;

    constructor() {
        this.database = new DatabaseService();
    }

    public run() {
        this.database.findHashtagsWithCompany().then(hashtagList => {
            this.twitterStream = new TwitterStream(this.groupHashtagsByCompanies(hashtagList));
            this.twitterStream.createStream(hashtagList.map(hashtag => `#${hashtag['hashtag']}`));
        });
    }

    private groupHashtagsByCompanies(hashtagList: Array<Object>): Object {
        let map = {};
        for (let hashtag of hashtagList) {
            let companyName = hashtag['company']['name'];
            if (!map[companyName]) {
                map[companyName] = [];
            }
            map[companyName].push(hashtag['hashtag'])
        }
        return map;
    }

}