import { Util } from '../utils/util';
import { AnalyzeService } from '../services/analyze_service';
import { DatabaseService } from '../database/database_service';
import Event from '../database/models/event';
import Activity from '../database/models/activity';
import {ActivityType} from "../database/activity_type";
import { EventType } from '../database/event_type';
import Company from '../database/models/company';
import Price from '../database/models/price';

export class AnalyzeBot {

    private util: Util;
    private analyzeService: AnalyzeService;
    private databaseService: DatabaseService;

    constructor() {
        this.util = new Util();
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


    private processPricesForCompany(company: Company): Promise<void> {
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

    private countMetrics(company: Company, allValues: Array<Price>): Promise<void> {
        let theNewestValue = allValues[0],
            analize = this.analyzeService.analizeCompany([...allValues], theNewestValue),
            analyzeKeys = Object.keys(analize).filter(key => analize[key]);

        console.log(`Count metrics for company ${company.name} for date ${theNewestValue['date']}`);
        return new Promise<void>( (resolve, reject) => {
            if (!analyzeKeys.length) {
                resolve();
            }

            Promise.all(analyzeKeys.map(key => this.upsertEvent(company, theNewestValue, key)))
            .then(() => resolve()).catch( err => reject(err));
        });
    }

    private upsertEvent(company: Company, theNewestValue: Price, key: string): Promise<void> {
        return new Promise<void>((resolve) => {
            Event.findOrCreate({
                where: {
                    company_id: company.id,
                    date: theNewestValue['date'].toDateString(),
                    type: EventType.ACTIVITY
                }
            }).then(event => {
                this.upsertActivity(event, theNewestValue, key)
                .then(() => {
                    console.log(`Created event and activity for company ${company['name']}: ${ActivityType[key]}`);
                    resolve()
                });
            });
        });
    }

    private upsertActivity(event: Event, price: Price, key: string): Promise<Activity> {
        return Activity.findOrCreate({
            where: {
                type: ActivityType[key],
                event_id: event.id,
                price_id: price.id
            }
        });
    }
}