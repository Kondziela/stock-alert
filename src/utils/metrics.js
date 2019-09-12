let minElement = (allValues, field) => allValues.reduce( (o1, o2) => o1[field] < o2[field] ? o1 : o2 ),
	maxElement = (allValues, field) => allValues.reduce( (o1, o2) => o1[field] > o2[field] ? o1 : o2 ),
	generateSetMetrics = (allValues, field) => {
		let min = minElement(allValues, field),
			max = maxElement(allValues, field);

			return {
				min: min,
				max: max
			}
	},
	isInMedianLowPercent = (todayObject, allValues, percent) => {
		let index = allValues.findIndex((object) => object.date == todayObject.date);

		return (1 - (index/allValues.length)) < percent;
	};


module.exports.generateSetMetrics = generateSetMetrics;
module.exports.isInMedianLowPercent = isInMedianLowPercent;