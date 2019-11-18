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

     public run() {
         console.log("Start Price Bot");
         this.database.init();
         this.database.findActiveCompanies( (companies) => {
             companies.forEach( company => {
                 console.log(`Download price for ${company['name']}`);
                 // TODO[AKO]: adjust for another markets
                 this.upsert.upsertPricesForUSA(company, this.util.today());
             });
         });
     }
}
