import { MainBot } from './main_bot';

let main = new MainBot();

console.log('Start Twitter Bot');

MainBot.initEnvironmentVariables()
    .then(() => main.startTwitterStreamBot())
    .catch(err => console.error(err));
