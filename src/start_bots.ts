import { MainBot } from './main_bot';

let main = new MainBot();

console.log('Start Scheduler');

MainBot.initEnvironmentVariables()
    .then(() => main.startProcessing())
    .catch(err => console.error(err));

