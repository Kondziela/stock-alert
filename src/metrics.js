let minElement = (allValues, field) => allValues.reduce( (o1, o2) => o1[field] < o2[field] ? o1 : o2 ),
	maxElement = (allValues, field) => allValues.reduce( (o1, o2) => o1[field] > o2[field] ? o1 : o2 ),
	generateSetMetrics = (allValues, field) => {
		let min = minElement(allValues, field),
			max = maxElement(allValues, field);

			return {
				min: min,
				max: max
			}
	};

module.exports.generateSetMetrics = generateSetMetrics;