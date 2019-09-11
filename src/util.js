var isInLow10Percent = (todayObject, allValues) => {
		let index = allValues.findIndex((object) => object.date == todayObject.date);

		console.log(index);

		return (1 - (index/allValues.length)) < 0.3;
	},
	// 252 is max of range
	oneYearAgo = () => {
		let date = new Date();
		date.setFullYear(date.getFullYear() - 1);
		return date.toISOString().substring(0, 10);
	}

module.exports.isInLow10Percent = isInLow10Percent;
module.exports.oneYearAgo = oneYearAgo;