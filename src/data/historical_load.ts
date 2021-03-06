import {AnalyzeBot} from "../bots/analyze_bot";
import {DatabaseService} from "../database/database_service";
import Company from "../database/models/company";
import {Util} from "../utils/util";

export class HistoricalData {

    private MINIMUM_PRICES: number = 200;
    private ONE_YEAR: number = 365;

    private analyzeBot: AnalyzeBot;
    private databaseService: DatabaseService;
    private util: Util;

    constructor() {
        this.analyzeBot =  new AnalyzeBot();
        this.databaseService = new DatabaseService();
        this.util = new Util();
    }

    public countHistorical() {
        this.databaseService.init().then(() => {
            this.databaseService.findActiveCompanies().then(companies => {
                companies.forEach(company => {
                    this.databaseService.findMinDateOfEvent(company).then(result => {
                        let lastDate = result[0].get('minDate') || new Date();
                        console.log(`${company.name}: ${lastDate}`);
                        this.countHistoricalForCompany(company, new Date(lastDate))
                    })
                });
            })
        });
    }

    private countHistoricalForCompany(company: Company, date: Date): void {
        let dateYearAgo = new Date(this.util.dateXDayAgo(this.ONE_YEAR, date));
        this.databaseService.findPricesForCompanyBetweenDate(company, dateYearAgo, date).then(prices => {
            console.log(`Found ${prices.length} prices`);
            if (prices.length < this.MINIMUM_PRICES) {
                return;
            }
            this.analyzeBot.countMetrics(company, prices).then(() => {
                let dayBefore = new Date(this.util.dateXDayAgo(1, date));
                this.countHistoricalForCompany(company, dayBefore);
                console.log(`Counted metrics for ${company.name} ${date}`);
            })
        });
    }

}