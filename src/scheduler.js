var schedule = require('node-schedule'),
	main = require('./main'),
	scheduleValue = '0 30 0 * * *';

let createSchedule = () => {
	console.log("Start Scheduler with value: " + scheduleValue);
	 
	// https://www.npmjs.com/package/node-schedule
	var j = schedule.scheduleJob(scheduleValue, function(){
	  main.mainProcess();
	});
}

module.exports.createSchedule = createSchedule;