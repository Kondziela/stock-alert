import { MainBot } from './main_bot';

let main = new MainBot();

console.log('Start Scheduler');

main.initEnvironmentVariables()
    .then(() => main.startProcessing())
    .catch(err => console.error(err));

