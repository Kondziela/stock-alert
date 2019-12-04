import {MainBot} from "./main_bot";

exports.handler = () => {
    MainBot.initEnvironmentVariables()
        .then(() => new MainBot().startDBCleanerBot())
        .catch(err => console.error(err));
};