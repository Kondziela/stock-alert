// https://medium.com/@arnab.k/how-to-keep-processes-running-after-ending-ssh-session-c836010b26a3
import { MainBot } from './main_bot';

let main = new MainBot();

console.log('Start Twitter Bot');

MainBot.initEnvironmentVariables()
    .then(() => main.startTwitterStreamBot())
    .catch(err => console.error(err));
