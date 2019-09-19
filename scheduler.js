const fs = require('fs')

const path = './src/data/token.js'

try {
  if (fs.existsSync(path)) {
  	let tokens = require(path);
    process.env.tiingi_token = tokens.tiingi_token;
    process.env.slack_webhooks = tokens.slack_webhooks;
    process.env.german_token = tokens.german_token;
  }
} catch(err) {
  console.log("Use default environment variables.");
}

require('./src/main').mainProcess();