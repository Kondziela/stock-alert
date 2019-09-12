var schedule = require('node-schedule'),
	main = require('./main'),
	scheduleValue = '18 20 * * *';

let createSchedule = () => {
	console.log("Start Scheduler with value: " + scheduleValue);
	 
	// https://www.npmjs.com/package/node-schedule
	return schedule.scheduleJob(scheduleValue, function(){
	  main.mainProcess();
	});
}

module.exports.createSchedule = createSchedule;