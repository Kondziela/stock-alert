const 	request = require('../senders/request'),
		parser = require('../utils/parser'),
		fs = require('fs');

process.env.tiingi_token = '91a345dff31524acd5a8097bfe840823208b9de7';

let downloadUSAData = (companyCode, startDate, fileName) => {
	let filePath = `../data/data_science/${fileName}.json`;
	
	try {
	  	console.log(`Request for ${fileName} data`);
	  	request.requestForUSAStock(companyCode, startDate).then( body => {
			let data = JSON.stringify(parser.parseTiingoResponse(body));

			console.log('Save data to file');
			fs.writeFile(fileName + '.json', data, function(err) {
			    if(err) {
			        return console.log(err);
			    }

			    console.log(`The file ${fileName} was saved!`);
			}); 

		});
	} catch(err) {
		console.log(err);
	  console.log(`File ${fileName}.json exists`);
	}
}

downloadUSAData('AMD', '2017-01-01', 'amd');
downloadUSAData('MSFT', '2017-01-01', 'microsoft');
downloadUSAData('TSLA', '2017-01-01', 'tesla');
downloadUSAData('AMZN', '2017-01-01', 'amazon');
downloadUSAData('TTWO', '2017-01-01', 'take2');
downloadUSAData('ATVI', '2017-01-01', 'blizzard');
downloadUSAData('NVDA', '2017-01-01', 'Nvidia');
downloadUSAData('INTC', '2017-01-01', 'Intel');
downloadUSAData('GOOGL', '2017-01-01', 'google');
downloadUSAData('AAPL', '2017-01-01', 'apple');
downloadUSAData('FB', '2017-01-01', 'facebook');
downloadUSAData('CSCO', '2017-01-01', 'cisco');
downloadUSAData('TEAM', '2017-01-01', 'atlassian');
downloadUSAData('DELL', '2017-01-01', 'dell');
downloadUSAData('NKE', '2017-01-01', 'nike');