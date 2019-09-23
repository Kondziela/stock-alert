const 	PolynomialRegression = require('ml-regression').PolynomialRegression,
		fs = require('fs'),
		MLR = require('ml-regression-multivariate-linear');

let loadData = (name) => JSON.parse(fs.readFileSync(`../data/data_science/${name}.json`, {'encoding': 'UTF-8'})),
	
	regression = () => {
		let data = loadData('facebook'),
			x = data.map( (o, index) => index * 1.0),
			y = data.map( o => o.close * 1.0),
			lastIndex = data.length - 1;

		const trainX = x.slice(0, lastIndex),
			trainY = y.slice(0, lastIndex),
			checkX = x.slice(lastIndex),
			checkY = y.slice(lastIndex);
			

		for (let degree = 1; degree < 11; degree++) {
			let regression = new PolynomialRegression(trainX, trainY, degree),
			value = regression.predict(checkX).map( (result, index) => Math.abs(result - checkY[index])).reduce((a,b) => a+b);
			console.log(`${degree}: ${value}`);
		}


	},

	multiParamRegression = () => {
		let data = loadData('facebook'),
			x = [],
			y = data.map( o => o.close * 1.0).slice(1),
			lastIndex = data.length - 1;

		for (let i = 1; i<data.length; i++) {
			x.push([data[i-1].open, data[i-1].close]);
		}
 
		const trainX = x.slice(0, lastIndex),
			trainY = y.slice(0, lastIndex),
			checkX = x.slice(lastIndex),
			checkY = y.slice(lastIndex);
		const mlr = new MLR(x, y);



		console.log(mlr.predict(checkX[0]) - checkY[0]);
	};

multiParamRegression();


// const x = [50, 50, 50, 70, 70, 70, 80, 80, 80, 90, 90, 90, 100, 100, 100];
// const y = [3.3, 2.8, 2.9, 2.3, 2.6, 2.1, 2.5, 2.9, 2.4, 3.0, 3.1, 2.8, 3.3, 3.5, 3.0];
// const degree = 5; // setup the maximum degree of the polynomial
// const regression = new PolynomialRegression(x, y, degree);
// console.log(regression.predict(80)); // Apply the model to some x value. Prints 2.6.
// console.log(regression.coefficients); // Prints the coefficients in increasing order of power (from 0 to degree).
// console.log(regression.toString(3)); // Prints a human-readable version of the function.