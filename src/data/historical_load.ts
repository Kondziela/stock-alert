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
                companies.forEach(company => this.countHistoricalForCompany(company, new Date()));
            })
        });
    }

    private countHistoricalForCompany(company: Company, date: Date): void {
        let dateYearAgo = new Date(this.util.dateXDayAgo(this.ONE_YEAR, date));
        this.databaseService.findPricesForCompanyBetweenDate(company, dateYearAgo, date).then(prices => {
            if (prices.length < this.MINIMUM_PRICES) {
                return;
            }
            this.analyzeBot.countMetrics(company, prices).then(() => {
                let dayBefore = new Date(this.util.dateXDayAgo(1, date));
                this.countHistoricalForCompany(company, dayBefore);
            })
        });
    }

}