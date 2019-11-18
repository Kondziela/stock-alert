import {Upsert} from "./database/upsert";
import Country from "./database/schema/country";
import {DatabaseService} from './database/database_service';
import Company from "./database/schema/company";
import {Util} from "./utils/util";

export class PriceBot {
     private upsert: Upsert;
     private database: DatabaseService;
     private util: Util;

     constructor() {
         this.upsert = new Upsert();
         this.database = new DatabaseService();
         this.util = new Util();
     }

     public run() {
         console.log("Start Price Bot");
         this.database.init();
         Country.find({}, (err, countries) => {
             countries.filter(o => o.active).forEach(country => {
                 Company.find({country: country}, (err, companies) => {
                     companies.forEach( company => {
                         console.log(`Download price for ${company['name']}`);
                         this.upsert.upsertPricesForUSA(company, this.util.today());
                     });
                 });
             });
         });
     }
}
