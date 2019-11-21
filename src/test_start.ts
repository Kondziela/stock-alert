import {MainBot} from "./main_bot";
import {TwitterSender} from "./senders/twitter_sender";

new MainBot().initEnvironmentVariables().then(() => {
    new TwitterSender().search({ q: '@CDR', lang: 'en'}).then( tweets => {
        console.log(tweets);
    });
});

