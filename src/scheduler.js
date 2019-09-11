var schedule = require('node-schedule'),
	main = require('./main'),
	scheduleValue = '0 30 0 * * *';

console.log("Start Scheduler with value: " + scheduleValue);
 
// https://www.npmjs.com/package/node-schedule
var j = schedule.scheduleJob(scheduleValue, function(){
  main.mainProcess();
});