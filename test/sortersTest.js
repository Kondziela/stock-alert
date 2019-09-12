const 	junit = require('junit').default,
		sorters = require('../src/utils/sorters');

module.exports = it => {
 
    it("sort table by date asc", () => {
    	let prevDate = new Date('2019-01-01'),
    		laterDate = new Date('2019-02-02'),
    		arr = [laterDate, prevDate];

    	arr.sort(sorters.sortByDateAsc);

    	it.eq(arr[0].toString(), prevDate.toString());
    	it.eq(arr[1].toString(), laterDate.toString());
    })

    it("sort table by close desc", () => {
    	let smaller = {close: 1},
    		bigger = {close: 2},
    		arr = [smaller, bigger];

    	arr.sort(sorters.sortByCloseDesc);

    	it.eq(arr[0].close, bigger.close);
    	it.eq(arr[1].close, smaller.close);
    })
};