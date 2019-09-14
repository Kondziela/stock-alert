var metrics = require('./utils/metrics'),
	util = require('./utils/util');

module.exports.slackResponse = (company, allValues, todaysValue, anaylyze) => {
	let measureMetric = metrics.generateSetMetrics(allValues, "close"),
		slackString = company.name + ": current: " + todaysValue.close + ": min: " + measureMetric.min.close + ", max: " + measureMetric.max.close;
		
	if (anaylyze.medianLowPercent) {
		slackString += " :arrow_down:";
	}
	if (anaylyze.bottomIntersectionOfMean) {
		slackString += " :chart:";
	}
	if (anaylyze.oneDayCandleEvent) {
		slackString += " :candle:";
	}

	console.log(`Found metrics for company ${company.name} ${measureMetric}`);

	return slackString;
}