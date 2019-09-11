var request = require('./request.js').requestToTiingo,
	util = require('./util'),
	sorters = require('./sorters'),
	parser = require('./parser'),
	metrics = require('./metrics'),
	sendToSlack = require('./slack_sender').sendToSlack,
	companies = require('./data/companies.js').companies;

let processCompany = (company) => {

		request(company.code, util.oneYearAgo())
			.then((body) => {
				let allValues = parser.parseTiingoResponse(body),

					todaysValue = allValues[allValues.length - 1],

					isLow = util.isInLow10Percent(todaysValue, allValues.sort(sorters.sortByClose));

				if (isLow) {
					let measureMetric = metrics.generateSetMetrics(allValues, "close"),
						slackString = company.name + ": current: " + todaysValue.close + ": min: " + measureMetric.min.close + ", max: " + measureMetric.max.close;
						console.log(measureMetric);
					sendToSlack(slackString);
				}
			});
	},
	mainProcess = () => {
		let slackInitMessage = "Watching companies:\n\r" + companies.map(o => o.name).join(', ');
		sendToSlack(slackInitMessage);
		sendToSlack("Company with relative low yearly price:\n\r");
		companies.forEach(processCompany);
	}

module.exports.mainProcess = mainProcess;