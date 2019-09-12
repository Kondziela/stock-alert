var parseTiingoResponse = (body) => 
	JSON.parse(body).map( object => {return {
		'date': object.date,
		'close': object.close
		// 'high': object.high,
		// 'low': object.low,
		// 'open': object.open
	}});

module.exports.parseTiingoResponse = parseTiingoResponse;