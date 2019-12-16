export class Parser {

	public parseTiingoResponse(body: string): Array<object> { 
		return JSON.parse(body).map( object => {return {
			'date': object.date,
			'close': object.close,
			'high': object.high,
			'low': object.low,
			'open': object.open,
			'volume': object.volume
		}})
	}


	/**
		Structure:
			  "Date",
		      "Open",
		      "High",
		      "Low",
		      "Close",
		      "Change",
		      "Traded Volume",
		      "Turnover",
		      "Last Price of the Day",
		      "Daily Traded Units",
		      "Daily Turnover"
	*/
	public parseQuandlResponse(data: string): Array<object> {
        return JSON.parse(data)['dataset']['data'].map( object => {return {
        	'date': object[0],
			'close': object[4],
			'high': object[2],
			'low': object[3],
			'open': object[1],
			'volume': object[6]
        }});
	}

}