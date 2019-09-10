var request = require('./request.js').requestToTiingo;

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


request('amd', /*yearAgo()*/ '2019-09-08')
	.then((body) => 
		console.log(JSON.parse(body).map( object => {return {
			'date': object.date,
			'close': object.close,
			'high': object.high,
			'low': object.low,
			'open': object.open
		}}))
	);

