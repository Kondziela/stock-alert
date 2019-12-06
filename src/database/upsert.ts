import Country from './schema/country';
import Company from './schema/company';
import Price from "./schema/price";
import Hashtag from './schema/hashtag';
import {ApiForMarket} from "../utils/api_for_market";
import { TwitterType } from './twitter_type';

export class Upsert {

    private apiForMarket: ApiForMarket;

    constructor() {
        this.apiForMarket = new ApiForMarket();
    }

    public upsertCountry(countries: Array<JSON>): Promise<Object[]> {
        return Promise.all(countries.map(country => {
                console.log(`Starting processing for ${country['country']}`);
                return new Promise(resolve => resolve());
                // return Country.findOneAndUpdate({
                //     country: country['country']
                // }, {}, {
                //     upsert: true,
                //     new: true
                // }).exec()
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
                    Promise.all(prices.map((price, index) => {
                        price['company'] = company;
                        console.log(`Processing ${index + 1}/${prices.length}. ${price['date']}`);
                        return Price.findOneAndUpdate(price, {}, {
                            upsert: true,
                            new: true
                        }).exec();
                    })).then(() => resolve())
                    .catch((err) => console.error(err));
                });
        });
    }

    // TODO[AKO]: should be integrated with rest of init load logic
    public upsertHashtags(hashtags: Array<Object>) {
        Company.find({}).exec().then(companies => {
            companies.forEach( company => {
                let hashtag = hashtags.find(h => h['company'].toLowerCase() === company['name'].toLowerCase());
                if (!hashtag) {
                    console.error(`No data for company ${company['name']}`);
                    return;
                }
                console.log(`Hashtags for company ${company['name']}: ${hashtag}`);
                hashtag['hashtags'].forEach(h => {
                    Hashtag.findOneAndUpdate({
                        company: company,
                        hashtag: h,
                        type: TwitterType.HASHTAG
                    }, {}, {
                        upsert: true, 
                        new: true
                    }).exec();
                });
            });
        });
    }

}


