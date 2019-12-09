import {TwitterStream} from "../senders/twitter/twitter_stream";
import {DatabaseService} from "../database/database_service";
import Hashtag from "../database/models/hashtag";

export class TwitterStreamBot {

    private database: DatabaseService;
    private twitterStream: TwitterStream;

    constructor() {
        this.database = new DatabaseService();
    }

    public run() {
        console.log('Starting Twitter Stream Bot');
        this.database.findHashtagsWithCompany().then(hashtagList => {
            console.log(`Bot will process ${hashtagList.length} hashtags`);
            this.twitterStream = new TwitterStream(this.groupHashtagsByCompanies(hashtagList));
            this.twitterStream.createStream(hashtagList.map(hashtag => `#${hashtag['hashtag']}`));
        });
    }

    private groupHashtagsByCompanies(hashtagList: Array<Hashtag>): Object {
        let map = {};
        for (let hashtag of hashtagList) {
            let company = JSON.stringify(hashtag['company']);
            if (!map[company]) {
                map[company] = [];
            }
            map[company].push(hashtag['hashtag'])
        }
        return map;
    }

}