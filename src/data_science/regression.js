const 	PolynomialRegression = require('ml-regression').PolynomialRegression;

let	generateNexValues = (data, days) => {
		let x = data.map( (o, index) => index * 1.0),
			y = data.map( o => o.close * 1.0),
			lastIndex = data.length - days,
			bestDegree = -1,
			bestMeasure = 1000000;

		const trainX = x.slice(0, lastIndex),
			trainY = y.slice(0, lastIndex),
			checkX = x.slice(lastIndex),
			checkY = y.slice(lastIndex);
			

		for (let degree = 1; degree < 11; degree++) {
			let regression = new PolynomialRegression(trainX, trainY, degree),
				measure = regression.predict(checkX).map( (result, index) => Math.abs(result - checkY[index])).reduce((a,b) => a + b);

			if (measure < bestMeasure) {
				bestMeasure = measure;
				bestDegree = degree;
			}
		}

		return new PolynomialRegression(x, y, bestDegree).predict(data.length);
	}

module.exports.generateNexValues = generateNexValues;
