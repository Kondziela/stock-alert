import * as htmlParser from 'node-html-parser';

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
	// TODO[AKO]: REPAIR ME!!!
	public parseQuandlResponse(body: string): Array<object> {
		return [];
		// let lines = htmlParser.parse(body, {pre: true}).querySelector('pre').firstChild.rawText.split('\n');

        // lines[0] = '{';
        // lines[lines.length - 1] = '}';

        // let json = JSON.parse(lines.join('\n'));

        // return json.dataset.data.map( object => {return {
        // 	'date': object[0],
		// 	'close': object[4],
		// 	'high': object[2],
		// 	'low': object[3],
		// 	'open': object[1],
		// 	'volume': object[6]
        // }});
	}

}