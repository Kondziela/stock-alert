 var // 252 is max of range
	oneYearAgo = () => {
		let date = new Date();
		date.setFullYear(date.getFullYear() - 1);
		return date.toISOString().substring(0, 10);
	},
	findTodayObject = (allValues, date) => {
		return allValues.reduce( (o1, o2) => o1.date == date ? o1 : o2 );
	},
	nearBy = (value1, value2) => (Math.abs(value1-value2) / (value1 < value2 ? value1 : value2)) < 0.1; 


module.exports.oneYearAgo = oneYearAgo;
module.exports.findTodayObject = findTodayObject;
module.exports.nearBy = nearBy;