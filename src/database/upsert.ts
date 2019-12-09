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
                return Country.findOrCreate({
                    where: {
                        country: country['country']
                    },
                    defaults: {
                        active: country['active']
                    }
                });
            })
        );
    }

    public upsertCompanies(country: Country, companies: Array<JSON>): Promise<Company[]> {
        return Promise.all(companies.map(company => {
            console.log(`Starting processing for ${company['name']}`);
                return Company.findOrCreate({
                    where: {
                        code: company['code'],
                        name: company['name'],
                        country_id: country.id
                    }
                });
            })
        );
    }

    public upsertPrices(company: Company, startDate: string): Promise<void> {
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

    // TODO[AKO]: should be integrated with rest of init load logic
    public upsertHashtags(hashtags: Array<Object>) {
        Company.findAll({}).then(companies => {
            companies.forEach( company => {
                let hashtag = hashtags.find(h => h['company'].toLowerCase() === company['name'].toLowerCase());
                if (!hashtag) {
                    console.error(`No data for company ${company['name']}`);
                    return;
                }
                console.log(`Hashtags for company ${company['name']}: ${hashtag}`);
                hashtag['hashtags'].forEach(h => {
                    Hashtag.findOrCreate({
                        where: {
                            company_id: company.id,
                            hashtag: h,
                            type: TwitterType.HASHTAG
                        }
                    });
                });
            });
        });
    }

}


