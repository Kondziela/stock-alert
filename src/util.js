var isInLowPercent = (todayObject, allValues, percent) => {
		let index = allValues.findIndex((object) => object.date == todayObject.date);

		console.log(index);

		return (1 - (index/allValues.length)) < percent;
	},
	// 252 is max of range
	oneYearAgo = () => {
		let date = new Date();
		date.setFullYear(date.getFullYear() - 1);
		return date.toISOString().substring(0, 10);
	}

module.exports.isInLowPercent = isInLowPercent;
module.exports.oneYearAgo = oneYearAgo;