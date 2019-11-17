import * as Slack from 'slack-node';

export class SlackSender {
 
	public sendToSlack(message) {
		let slack = new Slack();
		slack.setWebhook(process.env.slack_webhooks);
		
		slack.webhook({
			channel: "#make-money-stay-cheeki-breeki",
			username: "Cheeki Breeki",
			text: message
		}, function(err, response) {
			console.log("Send message to Slack");
		});
	} 
}