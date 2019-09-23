const 	tf = require('@tensorflow/tfjs'),
		fs = require('fs'),

	X_LAST_DAYS = 14,
	TRAINING_PERCENT = 0.7,
	INPUT_SIZE = 14 * 5;

let loadData = (name) => JSON.parse(fs.readFileSync(`../data/data_science/${name}.json`, {'encoding': 'UTF-8'})),
	convertForNN = (data, index, allValues) => {
		if (index < X_LAST_DAYS) return null;

		let input = [],
			today = data.date.toString().substring(0, 10);

		for (let i = index - X_LAST_DAYS; i<index; i++) {
			let obj = allValues[i];
			input.push(
				obj.open,
				obj.close,
				obj.high,
				obj.low,
				obj.volume
			);
		}

		// input.push(
		// 	today.substring(0, 4),
		// 	today.substring(5, 7),
		// 	today.substring(8, 10)
		// );

		return input;
	},
	max = (data, field) => data.map( o => o[field]).reduce( (a, b) => a > b ? a : b),
	normalization = (obj, maxOpen, maxClose, maxHigh, maxLow, maxVolume) => {
		obj.open = obj.open / maxOpen,
		obj.close = obj.close / maxClose,
		obj.high = obj.high / maxHigh,
		obj.low = obj.low / maxLow,
		obj.volume = obj.volume / maxVolume

		return obj; 
	},
	onEpochEnd = (epoch, logs) => {
		console.log(`||${epoch}||\n\r`);
	}

const model = tf.sequential();
model.add(tf.layers.dense({
	inputDim: INPUT_SIZE, //+ 3, // 14 days * 5 metrics + 3 date metrics
	units: 100,
	activation: 'relu',
	useBias: true,
	kernelInitializer: 'randomNormal',
	biasInitializer: 'randomNormal',
	// activityRegularizer: 'l1',
	batchSize: 16,
	name: 'input'
}));
model.add(tf.layers.dense({
	inputDim: 100,
	units: 200,
	activation: 'relu',
	useBias: true,
	kernelInitializer: 'randomNormal',
	biasInitializer: 'randomNormal',
	// activityRegularizer: 'l1l2',
	batchSize: 16,
	name: 'hiden_1'
}));
model.add(tf.layers.dense({
	inputDim: 200,
	units: 100,
	activation: 'relu',
	useBias: true,
	kernelInitializer: 'randomNormal',
	biasInitializer: 'randomNormal',
	// activityRegularizer: 'l1l2',
	batchSize: 16,
	name: 'hiden_2'
}));
model.add(tf.layers.dense({
	inputDim: 100,
	units: 1,
	activation: 'relu',
	useBias: true,
	kernelInitializer: 'randomNormal',
	biasInitializer: 'randomNormal',
	// activityRegularizer: 'l1l2',
	batchSize: 16,
	name: 'output'
}));

model.compile({
  loss: 'meanSquaredError',
  optimizer: 'sgd',
  metrics: ['MAE']
});

let allData  = loadData('amd'),
	allLength = allData.length - X_LAST_DAYS,
	maxOpen = max(allData, 'open'), maxClose = max(allData, 'close'),
	maxHigh = max(allData, 'high'), maxLow = max(allData, 'low'), maxVolume = max(allData, 'volume'),
	normData = allData.map(obj => normalization(obj, maxOpen, maxClose, maxHigh, maxLow, maxVolume)),
	allX = normData.map( convertForNN ).filter( o => o),
	allY = normData.slice(X_LAST_DAYS).map( o => o.close),
	tainingIndex = Math.floor(allX.length * TRAINING_PERCENT);

	

let 	trainingX = allX.slice(0, tainingIndex),
		trainingY = allY.slice(0, tainingIndex),
		validX = allX.slice(tainingIndex, allData.length),
		validY = allY.slice(tainingIndex, allData.length);

		console.log(trainingY.length);

const	trainingTensorX = tf.tensor(trainingX.flatMap( o => o), [trainingX.length, INPUT_SIZE]),
		trainingTensorY = tf.tensor(trainingY.flatMap( o => o), [trainingY.length, 1]),
		validTensorX = tf.tensor(validX.flatMap( o => o), [validX.length, INPUT_SIZE]),
		validTensorY = tf.tensor(validY.flatMap( o => o), [validY.length, 1]);




// Start model training process.
model.fit(trainingTensorX, trainingTensorY, {
  batchSize: 16,
  epochs: 25,
  shuffle: true,
  verbose: 1,
  validationData: [validTensorX, validTensorY]
   // Add the tensorBoard callback here.
  // callbacks: [onEpochEnd]
}).then(info => {
   console.log('Final accuracy', info.history);
 }).catch(err => {
 	console.log(err);
 });