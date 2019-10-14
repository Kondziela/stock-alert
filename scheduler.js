const fs = require('fs')

const path = './src/data/tokens.js'

console.log('Start Scheduler');

try {
  if (fs.existsSync(path)) {
  	let tokens = require(path);
    process.env.tiingi_token = tokens.tiingi_token;
    process.env.slack_webhooks = tokens.slack_webhooks;
    process.env.german_token = tokens.german_token;
    process.env.mongodb_user = tokens.mongodb_user;
    process.env.mongodb_password = tokens.mongodb_password;
  } else {
  	console.log("Use default environment variables.");
  }
} catch(err) {
  console.log("Use default environment variables.");
}

require('./src/main').mainProcess();