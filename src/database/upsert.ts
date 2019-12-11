import Country from './models/country';
import Company from './models/company';
import Price from "./models/price";
import Hashtag from './models/hashtag';
import {ApiForMarket} from "../utils/api_for_market";
import { TwitterType } from './twitter_type';

export class Upsert {

    private apiForMarket: ApiForMarket;

    constructor() {
        this.apiForMarket = new ApiForMarket();
    }

    public upsertCountry(countries: Array<JSON>): Promise<Country[]> {
        return Promise.all(countries.map(country => {
                console.log(`Starting processing for ${country['country']}`);
                return new Promise<Country>(resolve => {
                    Country.findOrCreate({
                        where: {
                            country: country['country']
                        },
                        defaults: {
                            active: country['active']
                        }
                    }).then(response => resolve(response[0]))
                })
            })
        );
    }

    public upsertCompanies(country: Country, companies: Array<JSON>): Promise<Company[]> {
        return Promise.all(companies.map(company => {
                console.log(`Starting processing for ${company['name']}`);
                return new Promise<Company>(resolve => {
                    Company.findOrCreate({
                        where: {
                            code: company['code'],
                            name: company['name'],
                            country_id: country.id
                        }
                    }).then(response => resolve(response[0]))
                })
            })
        );
    }

    public upsertPrices(company: Company, startDate: string): Promise<void> {
        console.log(company);
        let apiFunctions = this.apiForMarket.getAPIFunctionForMarket(company['country']['country']);

        return new Promise<void>( (resolve, reject) => {
            apiFunctions['requestFn'].call(this, company['code'], startDate)
                .then(data => {
                    let prices = apiFunctions['parserFn'].call(this, data);

                    console.log(`For company ${company['name']} downloaded ${prices.length} prices`);
                    Promise.all(prices.map((price, index) => {
                        price['company_id'] = company.id;
                        console.log(`Processing ${index + 1}/${prices.length}. ${price['date']}`);
                        return Price.findOrCreate({
                            where: price
                        });
                    })).then(() => resolve())
                    .catch((err) => console.error(err));
                });
        });
    }

    public upsertHashtags(hashtags: Array<{company: string, hashtags: Array<string>, mentions: Array<string>}>, company: Company): Promise<Hashtag[]> {
        let hashtag = hashtags.find(h => h['company'].toLowerCase() === company['name'].toLowerCase());
        if (!hashtag) {
            console.error(`No data for company ${company['name']}`);
            return;
        }
        console.log(`Hashtags for company ${company['name']}: ${hashtag}`);
        return Promise.all(hashtag['hashtags'].map(h => 
            new Promise<Hashtag>(resolve => 
            Hashtag.findOrCreate({
                where: {
                    company_id: company.id,
                    hashtag: h,
                    type: TwitterType.HASHTAG
                }
            }).then(result => resolve(result[0]))
            )
        ));
    }

}


