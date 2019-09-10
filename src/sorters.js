module.exports.sortByDate = (a, b) => {
	return (a.date > b.date) * 2 - 1;
}

module.exports.sortByClose = (a, b) => {
	return (a.close > b.close) * 2 - 1;
}