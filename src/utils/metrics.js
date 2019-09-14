const 	sorters = require('./sorters'),
		nearBy = require('./util').nearBy;

let minElement = (allValues, field) => allValues.reduce( (o1, o2) => o1[field] < o2[field] ? o1 : o2 ),
	maxElement = (allValues, field) => allValues.reduce( (o1, o2) => o1[field] > o2[field] ? o1 : o2 ),
	averageValue = (values, field) => {
		return values.map( value => value[field]).reduce( (a, b) => a + b) / values.length;
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
		allValues.sort(sorters.sortByCloseDesc);
		let index = allValues.findIndex((object) => object.date == todayObject.date);

		return (1 - (index/allValues.length)) < percent;
	},
	bottomIntersectionOfMean = (allValues, averageLength) => {
		allValues.sort(sorters.sortByDateAsc);
		let todaysDays = allValues.slice(0, averageLength),
			yesterdaysDays = allValues.slice(1, averageLength + 1);

		return todaysDays[0].close > averageValue(todaysDays, 'close') && yesterdaysDays[0].close < averageValue(yesterdaysDays, 'close');
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
		allValues.sort(sorters.sortByDateAsc);
		let today = allValues[0],
			yesterday = allValues[1];

		return today.volume > yesterday.volume * ratio;
	};

module.exports.generateSetMetrics = generateSetMetrics;
module.exports.medianLowPercent = medianLowPercent;
module.exports.bottomIntersectionOfMean = bottomIntersectionOfMean;
module.exports.oneDayCandleEvent = oneDayCandleEvent;
module.exports.volumeIncrease = volumeIncrease;