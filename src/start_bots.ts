import { MainBot } from './main_bot';

console.log('Start Scheduler');

MainBot.initEnvironmentVariables()
    .then(() => new MainBot().startProcessing())
    .catch(err => console.error(err));
