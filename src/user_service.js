var metrics = require('./utils/metrics'),
	util = require('./utils/util');

module.exports.slackResponse = (company, allValues, todaysValue) => {
	let measureMetric = metrics.generateSetMetrics(allValues, "close"),
		slackString = company.name + ": current: " + todaysValue.close + ": min: " + measureMetric.min.close + ", max: " + measureMetric.max.close;
		
	console.log(`Found metrics for company ${company.name} ${measureMetric}`);

	return slackString;
}