import { Util } from '../utils/util';
import { Sorter } from '../utils/sorters';
import { AnalyzeService } from '../analyze_service';
import { DatabaseService } from '../database/database_service';
import Event from '../database/schema/event';
import Activity from '../database/schema/activity';
import {ActivityType} from "./activity_type";
import {EventType} from "./EventType";

export class AnalyzeBot {

    private util: Util;
    private sorter: Sorter;
    private analyzeService: AnalyzeService;
    private databaseService: DatabaseService;

    constructor() {
        this.util = new Util();
        this.sorter = new Sorter();
        this.analyzeService = new AnalyzeService();
        this.databaseService = new DatabaseService();
    }

    public run(): void {
        console.log("Start analyzing bot");
        this.databaseService.init();
        this.databaseService.findActiveCompanies(companies => {
            companies.forEach( companie => {
                this.databaseService.findPricesForCompanyAfterDate(companie, new Date(this.util.oneYearAgo()), (prices) => {
                    console.log(`Find prices for company ${companie['name']}`);
                    this.countMetrics(companie, prices);
                });
            });
        });
    }

    private countMetrics(company: any, allValues: Array<any>): void {
        let todaysValue = allValues[0],
            analize = this.analyzeService.analizeCompany([...allValues], todaysValue);

        console.log(`Count metrics for company ${company.name}`);
        Object.keys(analize).filter(key => analize[key]).forEach(key => {
             Event.findOneAndUpdate({
                 company: company,
                 date: new Date(this.util.today()),
                 type: EventType.ACTIVITY
             }, {}, {upsert: true}, (err, event) => {
                 if (!err) {
                     Activity.findOneAndUpdate({
                         type: ActivityType[key],
                         event: event,
                         price: todaysValue
                     }, {}, {upsert: true}, (err) => {
                         if (!err) console.log(`Created event and activity for company ${company['name']}: ${ActivityType[key]}`);
                         else console.error(err);
                     });
                 } else console.error(err);
             });
        });
    }
}