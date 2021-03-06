const 	junit = require('junit').default,
		metrics = require('../src/utils/metrics');

module.exports = it => {
 
    it("find min and max element", () => {
    	let obj1 = {a: 1},
            obj2 = {a: 2},
            obj3 = {a: 3},
            arr = [obj3, obj1, obj2];

    	let result = metrics.generateSetMetrics(arr, 'a');

    	it.eq(obj1.a, result.min.a);
        it.eq(obj3.a, result.max.a);
    })

    it("median is in low 40% of values", () => {
        let values = [
                {close: 20, date: '2018'},
                {close: 10, date: '2019'},
                {close: 30, date: '2017'}
            ],
            today = {close:10, date: '2019'};

        let result = metrics.medianLowPercent(today, values, 0.4);

        it.eq(result, true);
    })

    it("median is NOT in low 40% of values", () => {
        let values = [
                {close: 20, date: '2018'},
                {close: 10, date: '2019'},
                {close: 30, date: '2017'}
            ],
            today = {close:20, date: '2018'};

        let result = metrics.medianLowPercent(today, values, 0.4);

        it.eq(result, false);
    })

    it("upward trend with intersection", () => {
        let values = [
                {close: 50, date: new Date('2019-01-01')},
                {close: 49, date: new Date('2019-01-02')},
                {close: 48, date: new Date('2019-01-03')},
                {close: 47, date: new Date('2019-01-04')},
                {close: 48, date: new Date('2019-01-05')},  // avg 48,2
                {close: 49, date: new Date('2019-01-06')}   // avg: 48,2
            ];

        let result = metrics.bottomIntersectionOfMean(values, 5);

        it.eq(result, true);
    })

    it("upward trend with previously intersection", () => {
        let values = [
                {close: 50, date: new Date('2019-01-01')},
                {close: 49, date: new Date('2019-01-02')},
                {close: 48, date: new Date('2019-01-03')},
                {close: 48, date: new Date('2019-01-04')},
                {close: 49, date: new Date('2019-01-05')},  // avg: 48,8
                {close: 50, date: new Date('2019-01-06')}   // avg: 48,8
            ];

        let result = metrics.bottomIntersectionOfMean(values, 5);

        it.eq(result, false);
    })

    it("upward trend without intersection", () => {
        let values = [
                {close: 50, date: new Date('2019-01-01')},
                {close: 49, date: new Date('2019-01-02')},
                {close: 48, date: new Date('2019-01-03')},
                {close: 47, date: new Date('2019-01-04')},
                {close: 46, date: new Date('2019-01-05')}, // avg: 48
                {close: 47, date: new Date('2019-01-06')}  // avg: 47,2
            ];

        let result = metrics.bottomIntersectionOfMean(values, 5);

        it.eq(result, false);
    })

    it("downward trend without intersection", () => {
        let values = [
                {close: 50, date: new Date('2019-01-01')},
                {close: 51, date: new Date('2019-01-02')},
                {close: 52, date: new Date('2019-01-03')},
                {close: 53, date: new Date('2019-01-04')},
                {close: 52, date: new Date('2019-01-05')}, // avg: 51,6
                {close: 51, date: new Date('2019-01-06')}  // avg: 51,8
            ];

        let result = metrics.bottomIntersectionOfMean(values, 5);

        it.eq(result, false);
    })

    it("downster candle", () => {
        let input = {
            open: 10, 
            close: 10.5, 
            low: 5, 
            high: 11
        };

         let result = metrics.oneDayCandleEvent(input);

         it.eq(result, true);   
    })

    it("downster candle", () => {
        let input = {
            open: 10, 
            close: 10.5, 
            low: 9.5, 
            high: 15
        };

         let result = metrics.oneDayCandleEvent(input);

         it.eq(result, true);   
    })

    it("candle doesn't exist, too small wings", () => {
        let input = {
            open: 10, 
            close: 12, 
            low: 9, 
            high: 16
        };

         let result = metrics.oneDayCandleEvent(input);

         it.eq(result, false);   
    })

    it("candle doesn't exist, wings too far", () => {
        let input = {
            open: 10, 
            close: 11, 
            low: 5, 
            high: 16
        };

         let result = metrics.oneDayCandleEvent(input);

         it.eq(result, false);   
    })

    it("candle doesn't exist, wings too near", () => {
        let input = {
            open: 10, 
            close: 11, 
            low: 9.5, 
            high: 11.5
        };

         let result = metrics.oneDayCandleEvent(input);

         it.eq(result, false);   
    })

    it("volume increases", () => {
        let today = {
                volume: 100,
                date: new Date('2019-10-10') 
            },
            yesterday = {
                volume: 10,
                date: new Date('2019-10-9')
            },
            arr = [yesterday, today];

        let result = metrics.volumeIncrease(arr, 2);

        it.eq(result, true);
    })

    it("volume increases not enought", () => {
        let today = {
                volume: 100,
                date: new Date('2019-10-10') 
            },
            yesterday = {
                volume: 60,
                date: new Date('2019-10-9')
            },
            arr = [yesterday, today];

        let result = metrics.volumeIncrease(arr, 2);

        it.eq(result, false);
    })

    it("volume doesn't increases", () => {
        let today = {
                volume: 100,
                date: new Date('2019-10-10') 
            },
            yesterday = {
                volume: 150,
                date: new Date('2019-10-9')
            },
            arr = [yesterday, today];

        let result = metrics.volumeIncrease(arr, 2);

        it.eq(result, false);
    })

    it("daily increase by ratio", () => {
        let today = {
            open: 10,
            close: 15
        }

        let result = metrics.dailyRaise(today, 0.05);

        it.eq(result, true);
    })

    it("daily NOT increase by ratio", () => {
        let today = {
            open: 10,
            close: 11
        }

        let result = metrics.dailyRaise(today, 0.2);

        it.eq(result, false);
    })

    it("daily fall by ratio", () => {
        let today = {
            open: 15,
            close: 10
        }

        let result = metrics.dailyFall(today, 0.05);

        it.eq(result, true);
    })

    it("daily NOT fall by ratio", () => {
        let today = {
            open: 11,
            close: 10
        }

        let result = metrics.dailyFall(today, 0.2);

        it.eq(result, false);
    })

    it("hole exists", () => {
        let today = {
                date: new Date('2019-09-09'),
                open: 11
            },
            yesterday = {
                date: new Date('2019-09-08'),
                close: 10
            },
            arr = [today, yesterday];

        let result = metrics.holeInChart(arr, 0.01);

        it.eq(result, true);
    })

    it("hole NOT exists", () => {
        let today = {
                date: new Date('2019-09-09'),
                open: 11
            },
            yesterday = {
                date: new Date('2019-09-08'),
                close: 10
            },
            arr = [today, yesterday];

        let result = metrics.holeInChart(arr, 0.2);

        it.eq(result, false);
    })

};