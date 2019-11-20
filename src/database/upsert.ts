import Country from './schema/country';
import Company from './schema/company';
import Price from "./schema/price";
import {ApiForMarket} from "../utils/api_for_market";

export class Upsert {

    private apiForMarket: ApiForMarket;

    constructor() {
        this.apiForMarket = new ApiForMarket();
    }

    public upsertCountry(countries: Array<JSON>): Promise<Object[]> {
        return Promise.all(countries.map(country => {
                console.log(`Starting processing for ${country['country']}`);
                return Country.findOneAndUpdate({
                    country: country['country']
                }, {}, {
                    upsert: true,
                    new: true
                }).exec()
            })
        );
    }

    public upsertCompanies(country: Object, companies: Array<JSON>): Promise<Object[]> {
        return Promise.all(companies.map(company => {
            console.log(`Starting processing for ${company['name']}`);
                return Company.findOneAndUpdate({
                    code: company['code'],
                    name: company['name'],
                    country: country
                }, {}, {
                    upsert: true,
                    new: true
                })
                .populate('country')
                .exec()
            })
        );
    }

    public upsertPrices(company: Object, startDate: string): Promise<void> {
        let apiFunctions = this.apiForMarket.getAPIFunctionForMarket(company['country']['country']);

        return new Promise<void>( (resolve, reject) => {
            apiFunctions['requestFn'].call(this, company['code'], startDate)
                .then(data => {
                    let prices = apiFunctions['parserFn'].call(this, data);

                    console.log(`For company ${company['name']} downloaded ${prices.length} prices`);
                    return Promise.all(prices.map((price, index) => {
                        price['company'] = company;
                        console.log(`Processing ${index + 1}/${prices.length}`);
                        return Price.findOneAndUpdate(price, {}, {
                            upsert: true,
                            new: true
                        }).exec();
                    }));
                });
        });
    }

}


