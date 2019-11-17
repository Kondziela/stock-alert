import {DatabaseService} from '../database/database_service';
import Country from '../database/schema/country';
import Company from '../database/schema/company';
import Price from '../database/schema/price';
import * as fs from 'fs';
import {Request} from '../senders/request';
import {Parser} from '../utils/parser';

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
    let database = new DatabaseService();
    database.init();

    loadCountries();
    

    // database.close();

};

let loadCountries = () => {
    let countries = JSON.parse(fs.readFileSync(__dirname + '/json/countries.json', 'utf-8').toString())

    countries.forEach(country => {
        console.log(`Starting processing for ${country}`);
        Country.findOneAndUpdate({country: country.country}, {}, {upsert: true}, (err, dbCountry) => {
            console.log("Country processed: ", dbCountry, err);
            if (!err) {
                loadCompaniesForCountry(dbCountry);
            }
        })
    });
};

let loadCompaniesForCountry = (country) => {
    let companies = JSON.parse(fs.readFileSync(__dirname + `/json/companies${country.country}.json`).toString());
                companies.forEach(company => {
                    Company.findOneAndUpdate({
                        code: company.code, 
                        name: company.name,
                        country: country
                    }, {}, {upsert: true}, (err, dbCompany) => {
                        console.log("Company processed: ", dbCompany, err);
                        if (!err) {
                            loadHistoricalData(dbCompany);
                        }
                    });
                });
};

let loadHistoricalData = (company) => {

    new Request().requestForUSAStock(company.code, '2014-01-01')
        .then( data => {
            let prices = new Parser().parseTiingoResponse(data);

            console.log(`For company ${company.name} downloaded ${prices.length} prices`);
            prices.forEach( (price, index) => {
                price['company'] = company;
                Price.findOneAndUpdate(price, {}, {upsert: true}, (err, dbPrice) => {
                    if (err) {
                        console.log("Error during insert price", err);
                    } else {
                        console.log(`Price ${index} added for compant ${company.name}`);
                    }
                });
            });
            
        });
}
