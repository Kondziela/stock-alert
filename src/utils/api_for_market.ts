import {Request} from "../senders/request";
import {Parser} from "./parser";

export class ApiForMarket {

    private request: Request;
    private parser: Parser;

    constructor() {
        this.request = new Request();
        this.parser = new Parser();
    }

    public getAPIFunctionForMarket(country: String): Object {
        switch (country) {
            case 'USA': return {
                requestFn: this.request.requestForUSAStock,
                parserFn: this.parser.parseTiingoResponse
            };
            case 'Germany': return {
                requestFn: this.request.requestForGermanStock,
                parserFn: this.parser.parseQuandlResponse
            };
            default: return {
                requestFn: () => {throw Error(`Update file api_for_market.ts for country ${country}`)},
                parserFn: () => {throw Error(`Update file api_for_market.ts for country ${country}`)}
            };
        }
    }

}