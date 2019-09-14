var util = require('./utils/util'),
	metrics = require('./utils/metrics');

const 	MEDIAN_PERCENT = 0.4,
		AVERAGE_DAYS = 14,
		VOLUME_INCREASE_RATIO = 2,
		DAILY_CHANGE_RATIO = 0.05;

let checkIfAnyTrue = (result) => Object.keys(result).some( key => result[key]),
	/**
	 * Check if current value is in low group of yearly median values.
	 */
	medianLowPercent = (todaysValue, allValues) => metrics.medianLowPercent(todaysValue, allValues, MEDIAN_PERCENT),
	/**
	 * Check if today was bottom intersection of mean. If yesterday value was under average value and today is upper then true.
	 */
	bottomIntersectionOfMean = (allValues) => metrics.bottomIntersectionOfMean(allValues, AVERAGE_DAYS),
	/**
	 * Check if today was any specific candles.
	 */
	oneDayCandleEvent = (today) => metrics.oneDayCandleEvent(today),
	/**
	 * Check if volument increases today.
	 */
	volumeIncrease = (allValues) => metrics.volumeIncrease(allValues, VOLUME_INCREASE_RATIO),
	/**
	 * Check if today was big price raise.
	 */
	dailyRaise = (today) => metrics.dailyRaise(today, DAILY_CHANGE_RATIO),
	/**
	 * Check if today was big price fall.
	 */
	dailyFall = (today) => metrics.dailyFall(today, DAILY_CHANGE_RATIO);

module.exports.anaylzeCompany = (allValues, todaysValue) => {

	let result =  {
			medianLowPercent: medianLowPercent(todaysValue, allValues),
			bottomIntersectionOfMean: bottomIntersectionOfMean(allValues),
			oneDayCandleEvent: oneDayCandleEvent(todaysValue),
			volumeIncrease: volumeIncrease(allValues),
			dailyRaise: dailyRaise(todaysValue),
			dailyFall: dailyFall(todaysValue)
		};


		result.anyLow = checkIfAnyTrue(result);

		return result;
}