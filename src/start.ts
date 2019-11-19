import { Main } from './main';

let main = new Main();

console.log('Start Scheduler');

main.initEnvironmentVariables()
    .then(() => main.startProcessing())
    .catch(err => console.error(err));

