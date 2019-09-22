const regression = require('./data_science/regression'),

	REGREASSION_CHECK_SET_SIZE = 1;

let regressionPrediction = (allValues) => regression.generateNexValues(allValues, REGREASSION_CHECK_SET_SIZE);

module.exports.predictPrice = (allValues) => {return {
	regression: regressionPrediction(allValues)
}}