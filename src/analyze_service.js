var util = require('./utils/util'),
	metrics = require('./utils/metrics'),
	sorters = require('./utils/sorters');

let checkIfAnyTrue = (result) => Object.keys(result).some( key => result[key]),
	isInMedianLowPercent = (todaysValue, allValues) => metrics.isInMedianLowPercent(todaysValue, allValues.sort(sorters.sortByClose), 0.4);

module.exports.anaylzeCompany = (allValues, todaysValue) =>{

	let result =  {
			isInMedianLowPercent: isInMedianLowPercent(todaysValue, allValues)
		};


		result.anyLow = checkIfAnyTrue(result);
		console.log(result);

		return result;
}