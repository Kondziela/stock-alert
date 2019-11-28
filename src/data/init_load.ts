import {DatabaseService} from '../database/database_service';
import * as fs from 'fs';
import * as path from 'path';
import {Upsert} from "../database/upsert";
import {MainBot} from "../main_bot";

/**
 * Script for initial load. Loads:
 *  - countries
 *  - companies
 *  - historical prices
 * 
 * WARNIGN: not all companies have all historical data in Tiingo e.g. DELL.
 */
export class InitLoad {
    private STARTING_DATE_FOR_PRICES = '2019-06-01';
    private upsert: Upsert;
    private database: DatabaseService;
    private main: MainBot;

    constructor() {
        this.upsert = new Upsert();
        this.database = new DatabaseService();
        this.main = new MainBot();
    }

    public run() {
        MainBot.initEnvironmentVariables()
            .then( () => this.database.init()
            .then( () => this.loadCountries()
            .then( (countries) => this.loadCompanies(countries)
            .then( (companies) => this.loadHistoricalDate(companies)
            .then( () => this.database.close())))))
            .catch( (err) => console.error(err));
    }

    private loadCountries(): Promise<Object[]> {
        let countries = JSON.parse(fs.readFileSync(path.join(__dirname, 'json', 'countries.json'), 'utf-8').toString())
        console.log('Load countries');
        return this.upsert.upsertCountry(countries);
    }

    private loadCompanies(countries: Object[]): Promise<Object[][]> {
        let countriesList = countries.filter( o => o['active']);
        console.log('Load companies');
        return Promise.all(countriesList.map( country => this.loadCompaniesForCountry(country)));
    }

    private loadCompaniesForCountry(country): Promise<Object[]> {
        let companies = JSON.parse(fs.readFileSync(path.join(__dirname,'json', `companies${country.country}.json`)).toString());
        console.log('Upset companies');
        return this.upsert.upsertCompanies(country, companies);
    }

    private loadHistoricalDate(companies: Array<Array<Object>>): Promise<void[]> {
        let companiesList = companies.length ? companies.reduce( (a, b) => a.concat(b)) : [];
        console.log('Analyze companies: ');
        return Promise.all(companiesList.map(company => {
            this.upsert.upsertPrices(company, this.STARTING_DATE_FOR_PRICES)
        }));
    }

    public loadHashtags() {
        this.database.init().then( () => { 
            let hashtags = JSON.parse(fs.readFileSync(path.join(__dirname, 'json', 'hashtags.json')).toString());
            this.upsert.upsertHashtags(hashtags);
        });
    }
}
