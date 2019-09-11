var schedule = require('node-schedule'),
	main = require('./main');
 
// https://www.npmjs.com/package/node-schedule
var j = schedule.scheduleJob('33 23 * * *', function(){
  main.mainProcess();
});