/**
 * API:
 *  - Tiingo - API for american stock trade.
 *  - Quandl - API for german stock tradehttps://www.quandl.com/data/FSE-Frankfurt-Stock-Exchange/usage/quickstart/api
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

    requestToTiingo = (company, startDate, endDate) => {
    	if (!company || !startDate) {
    		console.log("Company: " + company);
    		console.log("Start date: " + startDate);
    		throw new Error("Missing param");
    	}
    	let url = BASE_URL + company + '/prices?startDate=' + startDate + (endDate ? '&endDate=' + endDate : '');
    	requestOptions.url = url; 
    	return request(requestOptions);
    },

    requestGermanStock = () => {
        var options = {
          method: 'GET',
          url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-historical-data',
          qs: {
            frequency: '1d',
            filter: 'history',
            period1: '1546448400',
            period2: '1562086800',
            symbol: 'BMW.DE'
          },
          headers: {
            'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
            'x-rapidapi-key': process.env.german_token
          }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
        });
    }

module.exports.requestToTiingo = requestToTiingo;
module.exports.requestGermanStock = requestGermanStock;