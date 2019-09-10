var isInLow10Percent = (todayObject, allValues) => {
	let index = allValues.findIndex((object) => object.date == todayObject.date);

	console.log(index);

	return (1 - (index/allValues.length)) < 0.3;
}

module.exports.isInLow10Percent = isInLow10Percent;