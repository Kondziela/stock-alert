import { Util } from '../utils/util';
import { Sorter } from '../utils/sorters';
import { AnalyzeService } from '../services/analyze_service';
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

    public run(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log("Start analyzing bot");

            this.databaseService.findActiveCompanies().then(companies => {
                Promise.all(companies.map(company => this.processPricesForCompany(company))).then(() => {
                    console.log('End of processing for Analyze bot');
                    resolve();
                }).catch(err => reject(err));
            }).catch( err => reject(err));
        });
    }


    private processPricesForCompany(company: Object): Promise<void> {
        return new Promise<void>( (resolve, reject) => {
            this.databaseService.findPricesForCompanyAfterDate(company, new Date(this.util.oneYearAgo()))
                .then( prices => {
                    console.log(`Find prices for company ${company['name']}`);
                    this.countMetrics(company, prices).then( () => {
                        resolve();
                    }).catch( err => reject(err));
                }).catch( err => reject(err));
        });
    }

    private countMetrics(company: any, allValues: Array<any>): Promise<void> {
        let theNewestValue = allValues[0],
            analize = this.analyzeService.analizeCompany([...allValues], theNewestValue),
            analyzeKeys = Object.keys(analize).filter(key => analize[key]);

        console.log(`Count metrics for company ${company.name} for date ${theNewestValue['date']}`);
        return new Promise<void>( (resolve, reject) => {
            if (!analyzeKeys.length) {
                resolve();
            }
            analyzeKeys.forEach(key => {
                this.upsertEvent(company, theNewestValue['date']).then( event => {
                        this.upsertActivity(event, theNewestValue, key).then( () => {
                            console.log(`Created event and activity for company ${company['name']}: ${ActivityType[key]}`);
                            resolve();
                        }).catch( err => reject(err));
                }).catch( err => reject(err));
            });
        });
    }

    private upsertEvent(company: Object, date: Date): Promise<Object> {
        return Event.findOneAndUpdate({
            company: company,
            date: date,
            type: EventType.ACTIVITY
        }, {}, {
            upsert: true,
            new: true
        });
    }

    private upsertActivity(event: Object, price: Object, key: string): Promise<Object> {
        return Activity.findOneAndUpdate({
            type: ActivityType[key],
            event: event,
            price: price
        }, {}, {
            upsert: true,
            new: true
        });
    }
}