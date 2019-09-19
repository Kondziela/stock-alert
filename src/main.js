var request = require('./senders/request.js'),
	sendToSlack = require('./senders/slack_sender').sendToSlack,
	companies = require('./data/companies.js').companies,
	util = require('./utils/util'),
	parser = require('./utils/parser'),
	analyze_service = require('./analyze_service'),
	user_service = require('./user_service');

let processCompany = (company) => {

		request.requestToTiingo(company.code, util.oneYearAgo())
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
		// sendToSlack(user_service.watchingCompanies(companies));
		// sendToSlack(user_service.legend());
		// sendToSlack(user_service.analyzePrefix());

		// companies.forEach(processCompany);
		request.requestGermanStock();
			// .then(body => {
			// 	console.log(body)
			// });
	}

module.exports.mainProcess = mainProcess;