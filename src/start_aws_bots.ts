/**
 * AWS needs correct structure of layers:
 *  - nodejs/
 *    - package.json
 *    - package-lock.json
 *    - node_modules/
 */
import {MainBot} from "./main_bot";

exports.handler = () => {
    MainBot.initEnvironmentVariables()
        .then(() => new MainBot().startProcessing())
        .catch(err => console.error(err));
};