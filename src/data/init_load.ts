import {DatabaseService} from '../database/database_service';
import * as fs from 'fs';
import {Upsert} from "../database/upsert";

/**
 * Script for initial load. Loads:
 *  - countries
 *  - companies
 *  - historical prices
 * 
 * WARNIGN: not all companies have all historical data in Tiingo e.g. DELL.
 */
const STARTING_DATE_FOR_PRICES = '2014-01-01';
const upsert = new Upsert();
const database = new DatabaseService();

fs.readFile(__dirname + '/tokens.json', 'utf-8', (err, data) => {
    let tokens = JSON.parse(data.toString());
    process.env.tiingi_token = tokens['tiingi_token'];
    process.env.slack_webhooks = tokens['slack_webhooks'];
    process.env.german_token = tokens['german_token'];
    process.env.mongodb_user = tokens['mongodb_user'];
    process.env.mongodb_password = tokens['mongodb_password'];
    initLoad();
});

let initLoad = () => {
    database.init();

    loadCountries();

    // close db connection
};

let loadCountries = () => {
    let countries = JSON.parse(fs.readFileSync(__dirname + '/json/countries.json', 'utf-8').toString())

    upsert.upsertCountry(countries, loadCompaniesForCountry);
};

let loadCompaniesForCountry = (country) => {
    let companies = JSON.parse(fs.readFileSync(__dirname + `/json/companies${country.country}.json`).toString());

    upsert.upsertCompanies(country, companies, loadHistoricalData);
};

let loadHistoricalData = (company) => {
    // TODO[AKO]: adjust for another markets
    upsert.upsertPricesForUSA(company, STARTING_DATE_FOR_PRICES);
};
