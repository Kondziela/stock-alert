var request = require('./senders/request.js').requestToTiingo,
	sendToSlack = require('./senders/slack_sender').sendToSlack,
	companies = require('./data/companies.js').companies,
	util = require('./utils/util'),
	parser = require('./utils/parser'),
	analyze_service = require('./analyze_service'),
	user_service = require('./user_service');

let processCompany = (company) => {

		request(company.code, util.oneYearAgo())
			.then((body) => {
				let allValues = parser.parseTiingoResponse(body),
					todaysValue = allValues[allValues.length - 1];

					anaylyze = analyze_service.anaylzeCompany([...allValues], todaysValue);

					console.log(`Result for company ${company.name}: `, anaylyze);
				if (anaylyze.anyLow) {
					sendToSlack(user_service.slackResponse(company, [...allValues], todaysValue, anaylyze));
				}
			});
	},

	mainProcess = () => {
		let slackInitMessage = "Watching companies:\n\r" + companies.map(o => o.name).join(', ') + "\n\rCompany with relative low yearly price:";
		sendToSlack(slackInitMessage);
		companies.forEach(processCompany);
	}

mainProcess();

module.exports.mainProcess = mainProcess;