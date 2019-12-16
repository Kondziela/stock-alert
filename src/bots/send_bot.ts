import {DatabaseService} from "../database/database_service";
import {Util} from "../utils/util";
import {UserService} from "../services/user_service";
import {SlackSender} from "../senders/slack_sender";
import Activity from "../database/models/activity";

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

    public run(): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            console.log("Start sending bot");
            this.database.findActivitiesByDate(new Date(this.util.yesterday())).then((activities) => {
                console.log(`Number of processing activities: ${activities.length}`);
                let companyActivities = this.groupByCompany(activities),
                    slackResponse = this.userService.slackResponse(companyActivities);

                console.log(slackResponse);
                this.slackSender.sendToSlack(slackResponse);
                resolve();
            }).catch( err => reject(err));
        });
    }

    private groupByCompany(activities: Array<Activity>): Object {
        let companyActivities = {};

        activities.forEach(activity => {
            let company = activity['event']['company']['name'];
            if (!companyActivities.hasOwnProperty(company)) {
                companyActivities[company] = [];
            }
            companyActivities[company].push(activity['type']);
        });
        return companyActivities;
    }

}