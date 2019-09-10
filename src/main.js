var request = require('./request.js').requestToTiingo,
	isInLow10Percent = require('./util.js').isInLow10Percent,
	sorters = require('./sorters');

// 252 is max of range
var days252Ago = () => {
	let date = new Date();
	date.setFullYear(date.getFullYear() - 1);
	return date.toISOString().substring(0, 10);
}

/**
 * List of watching companies.
 */
var companies = ['amd'];


request('amd', /*yearAgo()*/ '2019-09-02')
	.then((body) => {
		let allValues = JSON.parse(body).map( object => {return {
			'date': object.date,
			'close': object.close
			// 'high': object.high,
			// 'low': object.low,
			// 'open': object.open
		}})

		console.log(allValues[allValues.length - 1]);
		console.log(allValues);
		let isLow = isInLow10Percent(allValues[allValues.length - 1], allValues.sort(sorters.sortByClose));

		console.log(isLow);
	}
	);

