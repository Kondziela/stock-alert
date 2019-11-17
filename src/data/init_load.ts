import {DatabaseService} from '../database/database_service';
import Country from '../database/schema/country';
import Company from '../database/schema/company';
import * as fs from 'fs';

fs.readFile(__dirname + '/tokens.json', 'utf-8', (err, data) => {
    let tokens = JSON.parse(data.toString());
    process.env.tiingi_token = tokens['tiingi_token'];
    process.env.slack_webhooks = tokens['slack_webhooks'];
    process.env.german_token = tokens['german_token'];
    process.env.mongodb_user = tokens['mongodb_user'];
    process.env.mongodb_password = tokens['mongodb_password'];
    console.log(`Mongo pass: ${process.env.mongodb_user}, ${process.env.mongodb_password}`)
    initLoad();
});

let initLoad = () => {
    let database = new DatabaseService();
    database.init();

    // load countries
    let countries = JSON.parse(fs.readFileSync(__dirname + '/json/countries.json', 'utf-8').toString())

    countries.forEach(country => {
        Country.findOneAndUpdate({country: country.country}, {}, {upsert: true}, (err, dbCountry) => {
            console.log("Country processed: ", dbCountry, err);
            if (!err) {
                let companies = JSON.parse(fs.readFileSync(__dirname + `/json/companies${dbCountry.country}.json`).toString());
                companies.forEach(company => {
                    Company.findOneAndUpdate({
                        code: company.code, 
                        name: company.name,
                        country: dbCountry
                    }, {}, {upsert: true}, (err, dbCompany) => {
                        console.log("Company processed: ", dbCompany, err);
                    });
                });
            }
        })
    });

    // database.close();

}

// let load
