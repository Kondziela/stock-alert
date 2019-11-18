import {DatabaseService} from "../database/database_service";
import {Util} from "../utils/util";

export class SendingBot {

    private database: DatabaseService;
    private util: Util;

    constructor() {
        this.database = new DatabaseService();
        this.util = new Util();
    }

    public run() {
        this.database.init();

        // TODO[AKO]: sync all promises
        console.log("Start sending bot");
        this.database.findEventsByDate(new Date(this.util.today())).then( (events) => {
            events.map(event => {
                this.database.findActivityByEvent(event)
            });
        });
    }

}