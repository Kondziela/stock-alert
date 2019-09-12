var cron = require('node-cron'),
	main = require('./main');


let createSchedule = () => {
	console.log("Start Scheduler with value: 30 0 * * *");
	 
	//https://github.com/node-cron/node-cron/tree/master/src
	return cron.schedule('30 0 * * *', function(){
	  main.mainProcess();
	});
}

module.exports.createSchedule = createSchedule;