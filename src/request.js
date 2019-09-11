/**
 * API:
 *  - Tiingo - API for american stock trade.
 */

var request = require('request-promise'),
	token = require('./token.js').token;


var	BASE_URL = 'https://api.tiingo.com/tiingo/daily/',
	requestOptions = {
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
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
    };

module.exports.requestToTiingo = requestToTiingo;