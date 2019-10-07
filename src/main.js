var request = require('./senders/request.js'),
	sendToSlack = require('./senders/slack_sender').sendToSlack,
	companiesUSA = require('./data/companiesUSA.js').companies,
	companiesGermany = require('./data/companiesGermany.js').companies,
	util = require('./utils/util'),
	parser = require('./utils/parser'),
	sorters = require('./utils/sorters'),
	analyze_service = require('./analyze_service'),
	user_service = require('./user_service'),
	predict_service = require('./predict_service');

let countMetrics = (company, allValues) => {
		allValues.sort(sorters.sortByDateAsc);

		let todaysValue = allValues[allValues.length - 1],
			anaylyze = analyze_service.anaylzeCompany([...allValues], todaysValue);

			console.log(`Result for company ${company.name}: `, anaylyze);
		if (anaylyze.anyLow) {
			let prediction = predictPrice(company, allValues);
			sendToSlack(
				user_service.slackMetricsResponse(company, [...allValues], todaysValue, anaylyze, prediction)
			);
		}
	},
	predictPrice = (company, allValues) => {
		allValues.sort(sorters.sortByDateAsc);

		let prediction = predict_service.predictPrice(allValues);

		return prediction;
		// sendToSlack(user_service.slackPredictionResponse(company, prediction));

	},
	processCompany = (company, requestFn, parsFn) => {

		requestFn.call(this, company.code, util.oneYearAgo())
			.then((body) => {
				countMetrics(company, parsFn.call(this, body));
			});
	},

	mainProcess = () => {
		sendToSlack(user_service.watchingCompanies(companiesUSA.concat(companiesGermany)));
		sendToSlack(user_service.legend());
		sendToSlack(user_service.analyzePrefix());

		companiesUSA.forEach(company => processCompany(company, request.requestForUSAStock, parser.parseTiingoResponse));
//		companiesGermany.forEach(company => processCompany(company, request.requestForGermanStock, parser.parseQuandlResponse));
	}

module.exports.mainProcess = mainProcess;