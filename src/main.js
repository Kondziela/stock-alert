var request = require('./senders/request.js').requestToTiingo,
	util = require('./utils/util'),
	sorters = require('./utils/sorters'),
	parser = require('./utils/parser'),
	metrics = require('./utils/metrics'),
	sendToSlack = require('./senders/slack_sender').sendToSlack,
	companies = require('./data/companies.js').companies;

let processCompany = (company) => {

		request(company.code, util.oneYearAgo())
			.then((body) => {
				let allValues = parser.parseTiingoResponse(body),

					todaysValue = allValues[allValues.length - 1],

					isLow = util.isInLowPercent(todaysValue, allValues.sort(sorters.sortByClose), 0.4);

				if (isLow) {
					let measureMetric = metrics.generateSetMetrics(allValues, "close"),
						slackString = company.name + ": current: " + todaysValue.close + ": min: " + measureMetric.min.close + ", max: " + measureMetric.max.close;
						console.log(`Found metrics for company ${company.name} ${measureMetric}`);
					sendToSlack(slackString);
				}
			});
	},
	mainProcess = () => {
		let slackInitMessage = "Watching companies:\n\r" + companies.map(o => o.name).join(', ') + "\n\rCompany with relative low yearly price:";
		sendToSlack(slackInitMessage);
		companies.forEach(processCompany);
	}

module.exports.mainProcess = mainProcess;