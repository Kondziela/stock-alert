import {Upsert} from "../database/upsert";
import {DatabaseService} from '../database/database_service';
import {Util} from "../utils/util";

export class PriceBot {
     private upsert: Upsert;
     private database: DatabaseService;
     private util: Util;

     constructor() {
         this.upsert = new Upsert();
         this.database = new DatabaseService();
         this.util = new Util();
     }

     public run(): Promise<void> {
         return new Promise<void>((resolve, reject) => {
             console.log("Start Price Bot");

             this.database.findActiveCompanies().then((companies) => {
                 Promise.all(companies.map(company => {
                     console.log(`Download price for ${company['name']}`);
                     return this.upsert.upsertPrices(company, this.util.yesterday());
                 })).then(() => {
                     console.log('End processing Price Bot');
                     resolve()
                 }).catch( err => reject(err));
             }).catch(err => reject(err));
         });
     }
}
