var schedule = require('node-schedule'),
	main = require('./main');
 
// https://www.npmjs.com/package/node-schedule
var j = schedule.scheduleJob('5 * * * * *'/*'0 0 23 * * *'*/, function(){
  main.mainProcess();
});