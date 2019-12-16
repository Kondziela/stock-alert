import { Util } from '../utils/util';
import { AnalyzeService } from '../services/analyze_service';
import { DatabaseService } from '../database/database_service';
import {ActivityType} from "../database/activity_type";
import Company from '../database/models/company';
import Price from '../database/models/price';
import {Upsert} from "../database/upsert";

export class AnalyzeBot {

    private util: Util;
    private analyzeService: AnalyzeService;
    private databaseService: DatabaseService;
    private upsert: Upsert;

    constructor() {
        this.util = new Util();
        this.analyzeService = new AnalyzeService();
        this.databaseService = new DatabaseService();
        this.upsert = new Upsert();
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

        console.log(`Count metrics for company ${company.name} for date ${theNewestValue.date}`);
        return new Promise<void>( (resolve, reject) => {
            if (!analyzeKeys.length) {
                console.log('No events found');
                resolve();
            }

            console.log(`${company.name} has ${analyzeKeys.length} events`);
            Promise.all(analyzeKeys.map(key => this.createEventAndActivity(company, theNewestValue, key)))
            .then(() => resolve()).catch( err => reject(err));
        });
    }

    private createEventAndActivity(company: Company, theNewestValue: Price, key: string): Promise<void> {
        return new Promise<void>(resolve => {
            this.upsert.upsertEvent(company, theNewestValue)
                .then(response => {
                    let event = response[0];
                    this.upsert.upsertActivity(event, theNewestValue, key).then(() => {
                        console.log(`Created event and activity for company ${company['name']}: ${ActivityType[key]}`);
                        resolve()
                    });
                })
        });
    }
}