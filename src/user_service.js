var metrics = require('./utils/metrics'),
	util = require('./utils/util');

module.exports.slackResponse = (company, allValues, todaysValue, anaylyze) => {
	let measureMetric = metrics.generateSetMetrics(allValues, "close"),
		slackString = company.name + ": current: " + todaysValue.close + ": min: " + measureMetric.min.close + ", max: " + measureMetric.max.close;
		
	if (anaylyze.medianLowPercent) {
		slackString += " :arrow_down:";
	}
	if (anaylyze.bottomIntersectionOfMean) {
		slackString += " :chart_with_upwards_trend:";
	}
	if (anaylyze.oneDayCandleEvent) {
		slackString += " :candle:";
	}
	if (anaylyze.volumeIncrease) {
		slackString += " :man-boy-boy:"
	}

	console.log(`Found metrics for company ${company.name} ${measureMetric}`);

	return slackString;
}

module.exports.initMessage = (companies) => "Watching companies:\n\r" + companies.map(o => o.name).join(', ') + "\n\rCompany with relative low yearly price:";

module.exports.legend = () => 
	"Legend:\n\r" +
	" - :arrow_down: - in low percent of yearly median\n\r" + 
	" - :chart_with_upwards_trend: - bottom intersetion of mean\n\r" + 
	" - :candle: - unique candle event\n\r" +
	" - :man-boy-boy: - volume increase";