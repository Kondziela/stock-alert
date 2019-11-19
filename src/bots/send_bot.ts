import {DatabaseService} from "../database/database_service";
import {Util} from "../utils/util";
import {UserService} from "../user_service";
import {SlackSender} from "../senders/slack_sender";

export class SendingBot {

    private database: DatabaseService;
    private util: Util;
    private userService: UserService;
    private slackSender: SlackSender;

    constructor() {
        this.database = new DatabaseService();
        this.util = new Util();
        this.userService = new UserService();
        this.slackSender = new SlackSender();
    }

    public run() {
        this.database.init();

        console.log("Start sending bot");
        this.database.findEventsByDate(new Date(this.util.today())).then( (events) => {
            console.log(`Number of processing events: ${events.length}`);
            Promise.all(events.map(event => this.database.findActivityByEvent(event))).then((activities: Array<Array<Object>>) => {
                let companyActivities = this.groupByCompany(activities.reduce((a, b) => a.concat(b))),
                    slackResponse = this.userService.slackResponse(companyActivities);
                console.log(slackResponse);

                this.slackSender.sendToSlack(slackResponse);
                this.database.close();
            });
        });
    }

    private groupByCompany(activities: Array<Object>): Object {
        let companyActivities = {};

        activities.forEach(activity => {
            let company = activity['event']['company']['name'];
            if (!companyActivities.hasOwnProperty(company)) {
                companyActivities[company] = [];
            }
            companyActivities[company].push(activity['type']);
        });
        console.log(`Activity: ${companyActivities}`);
        return companyActivities;
    }

}