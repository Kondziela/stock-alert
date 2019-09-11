var Slack = require('slack-node'),
	slack_webhooks = require('./token').slack_webhooks;
 
slack = new Slack();
slack.setWebhook(slack_webhooks);
 
slack.webhook({
  channel: "#make-money-stay-cheeki-breeki",
  username: "Cheeki Breeki",
  text: "Stay Cheeki Breeki"
}, function(err, response) {
  console.log(response);
});