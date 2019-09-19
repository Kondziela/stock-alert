/**
 * API:
 *  - Tiingo - API for american stock trade.
 *  - Quandl - API for german stock trade https://www.quandl.com/data/FSE-Frankfurt-Stock-Exchange/usage/quickstart/api
 *
 * Possible API:
 *  - Deautsche Boese
 *  - Yahoo https://rapidapi.com/apidojo/api/yahoo-finance1/
 */

var request = require('request-promise');


var	BASE_URL = 'https://api.tiingo.com/tiingo/daily/',
	requestOptions = {
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + process.env.tiingi_token
            }
        },

    requestForUSAStock = (company, startDate) => {
    	if (!company || !startDate) {
    		console.log("Company: " + company);
    		console.log("Start date: " + startDate);
    		throw new Error("Missing param");
    	}
    	let url = BASE_URL + company + '/prices?startDate=' + startDate;
    	requestOptions.url = url; 
    	return request(requestOptions);
    },

    requestForGermanStock = (company, startDate) => {
        var options = {
          method: 'GET',
          url: `https://www.quandl.com/api/v3/datasets/FSE/${company}?start_date=${startDate}&api_key=${process.env.german_token}`
        };

        console.log(`Request for german stock: ${options.url}`);
        return request(options);
    }

module.exports.requestForUSAStock = requestForUSAStock;
module.exports.requestForGermanStock = requestForGermanStock;