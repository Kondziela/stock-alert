var metrics = require('./utils/metrics'),
	util = require('./utils/util');

module.exports.slackMetricsResponse = (company, allValues, todaysValue, anaylyze, prediction) => {
	let measureMetric = metrics.generateSetMetrics(allValues, "close"),
		slackString = `${company.name}: current: ${todaysValue.close}, min: ${measureMetric.min.close}, max: ${measureMetric.max.close}`,
		predict = prediction.regression.toFixed(2);
		
	slackString += " pred: " + predict;

	if (predict < todaysValue.close) {
		slackString += ' :red_circle:'
	} else {
		slackString += ' :green_heart:'
	}

	if (anaylyze.medianLowPercent) {
		slackString += " :moneybag:";
	}
	if (anaylyze.bottomIntersectionOfMean || anaylyze.bottomIntersectionOfMean5And20 || anaylyze.bottomIntersectionOfMean50And200) {
		slackString += " :chart_with_upwards_trend:";
	}
	if (anaylyze.oneDayCandleEvent) {
		slackString += " :candle:";
	}
	if (anaylyze.volumeIncrease) {
		slackString += " :man-boy-boy:"
	}
	if (anaylyze.dailyRaise) {
		slackString += " :arrow_up:"
	}
	if (anaylyze.dailyFall) {
		slackString += " :arrow_down_small:"
	}
	if (anaylyze.holeInChart) {
		slackString += " :hole:"
	}

	console.log(`Found metrics for company ${company.name} ${measureMetric}`);

	return slackString;
}

module.exports.slackPredictionResponse = (company, prediction) => `Tomorrow price prediction:\n\r regression: ${prediction.regression}`;

module.exports.watchingCompanies = (companies) => "Watching companies:\n\r" + companies.map(o => o.name).join(', ');
module.exports.analyzePrefix = () => "Company with relative low yearly price:";
module.exports.legend = () => 
	"Legend:\n\r" +
	" - :moneybag: - in low percent of yearly median\n\r" + 
	" - :chart_with_upwards_trend: - bottom intersetion of todays, 5 days or 50 days mean\n\r" + 
	" - :candle: - unique candle event\n\r" +
	" - :man-boy-boy: - volume increase\n\r" +
	" - :arrow_up: - big price raise\n\r" +
	" - :arrow_down_small: - big price fall\n\r" +
	" - :hole: - hole on chart\n\r" +
	" - :green_heart:/:red_circle: - probably raise/fall";