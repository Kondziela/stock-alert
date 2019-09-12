var parseTiingoResponse = (body) => 
	JSON.parse(body).map( object => { return {
		'date': object.date,
		'close': object.close,
		'high': object.high,
		'low': object.low,
		'open': object.open,
		'volume': object.volume
	}});

module.exports.parseTiingoResponse = parseTiingoResponse;