/**
 * API:
 *  - Tiingo - API for american stock trade.
 *  - Quandl - API for german stock trade https://www.quandl.com/data/FSE-Frankfurt-Stock-Exchange/usage/quickstart/api
 *
 * Possible API:
 *  - Deautsche Boese
 *  - Yahoo https://rapidapi.com/apidojo/api/yahoo-finance1/
 */

import * as request from 'request-promise';

export class Request {

    private static TIINGO_URL: string = 'https://api.tiingo.com/tiingo/daily/';
    private static QUANDL_URL: string = 'https://www.quandl.com/api/v3/datasets/FSE/';

    public requestForUSAStock(company: string, startDate: string): Promise<string> {
    	if (!company || !startDate) {
    		console.log("Company: " + company);
    		console.log("Start date: " + startDate);
    		throw new Error("Missing param");
        }
        
        let url = Request.TIINGO_URL + `${company}/prices?startDate=${startDate}`,
            requestOptions = {
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + process.env.tiingi_token
                    },
                'url': url
                };

    	return request(requestOptions);
    }

    public requestForGermanStock(company: string, startDate: string): Promise<string> {
        var options = {
          method: 'GET',
          url: Request.QUANDL_URL + `${company}?start_date=${startDate}&api_key=${process.env.german_token}`
        };

        console.log(`Request for german stock: ${options.url}`);
        return request(options);
    }
}