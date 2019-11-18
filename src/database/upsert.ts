import Country from './schema/country';
import Company from './schema/company';
import Price from './schema/price';
import {Request} from '../senders/request';
import {Parser} from '../utils/parser';

export class Upsert {

    private request: Request;
    private parser: Parser;

    constructor() {
        this.request = new Request();
        this.parser = new Parser();
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

    public upsertPricesForUSA(company: Object, startDate: string, callbackFn?: Function): void {

        new Request().requestForUSAStock(company['code'], startDate)
            .then( data => {
                let prices = this.parser.parseTiingoResponse(data);

                console.log(`For company ${company['name']} downloaded ${prices.length} prices`);
                prices.forEach( (price, index) => {
                    price['company'] = company;
                    Price.findOneAndUpdate(price, {}, {upsert: true}, (err, dbPrice) => {
                        if (!err) {
                            console.log(`Upsert price for ${company['name']} ${index}/${prices.length}`);
                            if (callbackFn) callbackFn.call(this);
                        } else {
                            console.error(`Error during price upsert ${err}`);
                        }
                    });
                });

            });
    }

}


