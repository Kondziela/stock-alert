import Country from './schema/country';
import Company from './schema/company';
import Price from "./schema/price";
import {ApiForMarket} from "../utils/api_for_market";

export class Upsert {

    private apiForMarket: ApiForMarket;

    constructor() {
        this.apiForMarket = new ApiForMarket();
    }

    public upsertCountry(countries: Array<JSON>, callbackFn: Function): void {
        countries.forEach(country => {
            console.log(`Starting processing for ${country['country']}`);
            Country.findOneAndUpdate({country: country['country']}, {}, {upsert: true}, (err, dbCountry) => {
                if (!err) {
                    console.log(`Upsert country ${country['country']}`)
                    if (callbackFn) callbackFn.call(this, dbCountry);
                } else {
                    console.error(`Error during upsert country ${err}`);
                }
            })
        });
    }

    public upsertCompanies(country: Object, companies: Array<JSON>, callbackFn: Function): void {
        companies.forEach(company => {
            console.log(`Starting processing for ${company['name']}`)
            Company.findOneAndUpdate({
                code: company['code'],
                name: company['name'],
                country: country
            }, {}, {upsert: true}, (err, dbCompany) => {
                if (!err) {
                    console.log(`Upsert company ${company['name']}`)
                    if (callbackFn) callbackFn.call(this, dbCompany);
                } else {
                    console.error(`Error during upsert company ${err}`);
                }
            });
        });
    }

    public upsertPrices(company: Object, startDate: string): Promise<void> {
        let apiFunctions = this.apiForMarket.getAPIFunctionForMarket(company['country']['country']);

        return new Promise<void>( (resolve, reject) => {
            apiFunctions['requestFn'].call(this, company['code'], startDate)
                .then(data => {
                    let prices = apiFunctions['parserFn'].call(this, data);

                    console.log(`For company ${company['name']} downloaded ${prices.length} prices`);
                    Promise.all(prices.map((price, index) => {
                        price['company'] = company;
                        console.log(`Processing ${index + 1}/${prices.length}`);
                        return Price.findOneAndUpdate(price, {}, {upsert: true});
                    })).then( () => {
                        resolve();
                    }).catch( err => {
                        reject(err);
                    });
                });
        });
    }

}


