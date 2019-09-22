// today -> all[length - 1]
module.exports.sortByDateAsc = (a, b) => {
	return (a.date > b.date) * 2 - 1;
}

module.exports.sortByCloseDesc = (a, b) => {
	return (a.close < b.close) * 2 - 1;
}