const 	sorters = require('./sorters'),
		nearBy = require('./util').nearBy;

let minElement = (allValues, field) => allValues.reduce( (o1, o2) => o1[field] < o2[field] ? o1 : o2 ),
	maxElement = (allValues, field) => allValues.reduce( (o1, o2) => o1[field] > o2[field] ? o1 : o2 ),
	averageValue = (values, field) => values.map( value => value[field]).reduce( (a, b) => a + b, 0) / values.length,
	averageOfDays = (values, days, offset) => averageValue(values.slice(0 + offset, days), 'close'),
	bottomIntersectionOfMean = (mainToday, mainYesterday, intersectionToday, intersectionYesterday) => {
		return mainYesterday > intersectionYesterday && mainToday < intersectionToday;
	},
	bottomIntersectionOfMeanByDays = (allValues, main, intersection) => {
		let intersectionToday = averageOfDays(allValues, main, 0),
			intersectionYesterday = averageOfDays(allValues, main, 1),
			mainToday = averageOfDays(allValues, intersection, 0),
			mainYesterday = averageOfDays(allValues, intersection, 1);

		return bottomIntersectionOfMean(mainToday, mainYesterday, intersectionToday, intersectionYesterday);
	},
	generateSetMetrics = (allValues, field) => {
		let min = minElement(allValues, field),
			max = maxElement(allValues, field);

			return {
				min: min,
				max: max
			}
	},
	medianLowPercent = (todayObject, allValues, percent) => {
		let index = allValues.findIndex((object) => object.date == todayObject.date);

		return (1 - (index/allValues.length)) < percent;
	},
	
	oneDayCandleEvent = ({open, close, low, high}) => {
		let openClose = Math.abs(open - close),
			minMax = Math.abs(low - high);

		if ((openClose/minMax) < 0.25) {
			return (nearBy(open, low) && !nearBy(open, high)) || (nearBy(close, low) && !nearBy(close, high)) // upper candle
				|| (!nearBy(open, low) && nearBy(open, high)) || (!nearBy(close, low) && nearBy(close, high));// uppster candle
		}
		return false;
	},
	volumeIncrease = (allValues, ratio) => {
		let today = allValues[0],
			yesterday = allValues[1];

		return today.volume > yesterday.volume * ratio;
	},
	dailyRaise = (today, ratio) => today.close > (today.open + (today.open * ratio)),
	dailyFall = (today, ratio) => today.close < (today.open - (today.open * ratio)),
	holeInChart = (allValues, ratio) => {
		let todaysOpen = allValues[0].open,
			yesterdayClose = allValues[1].close;

		return todaysOpen > (1 + ratio) * yesterdayClose || todaysOpen < (1 - ratio) * yesterdayClose;
	}

module.exports.generateSetMetrics = generateSetMetrics;
module.exports.medianLowPercent = medianLowPercent;
module.exports.bottomIntersectionOfMeanByDays = bottomIntersectionOfMeanByDays;
module.exports.oneDayCandleEvent = oneDayCandleEvent;
module.exports.volumeIncrease = volumeIncrease;
module.exports.dailyRaise = dailyRaise;
module.exports.dailyFall = dailyFall;
module.exports.holeInChart = holeInChart;