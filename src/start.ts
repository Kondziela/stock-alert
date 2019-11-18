import { Main } from './main';
import * as fs from 'fs';

const path = __dirname + '/data/tokens.json'

console.log('Start Scheduler');

try {
  if (fs.existsSync(path)) {
      console.log('Token exist');
    fs.readFile(path, 'utf-8', (err, data) => {
        let tokens = JSON.parse(data.toString());
        process.env.tiingi_token = tokens['tiingi_token'];
        process.env.slack_webhooks = tokens['slack_webhooks'];
        process.env.german_token = tokens['german_token'];
        process.env.mongodb_user = tokens['mongodb_user'];
        process.env.mongodb_password = tokens['mongodb_password'];
        new Main().mainProcess();
    });
  } else {
      console.log("Use default environment variables. Tokens don't exist.");
      new Main().mainProcess();
  }
} catch(err) {
  console.log("Use default environment variables. Error during processing.");
  new Main().mainProcess();
}

