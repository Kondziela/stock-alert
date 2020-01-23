import {DatabaseService} from "../database/database_service";
import {Util} from "../utils/util";


export class DBCleanerBot {

    private database: DatabaseService;
    private util: Util;

    constructor() {
        this.database = new DatabaseService();
        this.util = new Util();
    }

    public run(): Promise<void> {
        console.log('Start DB Cleaner');
        return new Promise<void>(resolve => {
            let lastDate = this.util.dateXDayAgo(3, new Date());
            this.database.deleteTweetsBuffOlderThat(new Date(lastDate)).then(() => resolve());
        });
    }

}