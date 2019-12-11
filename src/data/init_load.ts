import {DatabaseService} from '../database/database_service';
import * as fs from 'fs';
import * as path from 'path';
import {Upsert} from "../database/upsert";
import {MainBot} from "../main_bot";
import Company from '../database/models/company';
import Country from "../database/models/country";
import Hashtag from '../database/models/hashtag';

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

    constructor() {
        this.upsert = new Upsert();
        this.database = new DatabaseService();
    }

    public run(): Promise<any> {
        return MainBot.initEnvironmentVariables()
            .then(() => this.database.init()
            .then(() => this.loadCountries()
            .then(() => this.loadCompanies()
            .then(() => this.loadHistoricalDate()
            .then(() => this.loadHashtags()
            .then(() => this.database.close))))));
    }

    private loadCountries(): Promise<Country[]> {
        let countries = JSON.parse(fs.readFileSync(path.join(__dirname, 'json', 'countries.json'), 'utf-8').toString())
        console.log('Load countries');
        return this.upsert.upsertCountry(countries);
    }

    private loadCompanies(): Promise<Company[][]> {
        return this.database.findAllActiveCountries().then(countriesList => {
            console.log(`Load companies for ${countriesList.length} countries`);
            return Promise.all(countriesList.map( country => this.loadCompaniesForCountry(country)));
        })
    }

    private loadCompaniesForCountry(country): Promise<Company[]> {
        let companies = JSON.parse(fs.readFileSync(path.join(__dirname,'json', `companies${country.country}.json`)).toString());
        console.log(`Upset companies for ${country.country}`);
        return this.upsert.upsertCompanies(country, companies);
    }

    private loadHistoricalDate(): Promise<void[]> {
        return this.database.findActiveCompanies().then(companiesList => {
            console.log(`Load historical prices for ${companiesList.length} companies`);
            return Promise.all(companiesList.map(company => this.upsert.upsertPrices(company, this.STARTING_DATE_FOR_PRICES)));
        });
    }

    private loadHashtags(): Promise<Hashtag[][]> {
        return this.database.findActiveCompanies().then(companies => {
            let hashtags = JSON.parse(fs.readFileSync(path.join(__dirname, 'json', 'hashtags.json')).toString());
            return Promise.all(companies.map(company => 
                this.upsert.upsertHashtags(hashtags, company)
            ))
        })
    }
}
