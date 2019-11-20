import { DatabaseService } from './database/database_service';
import {PriceBot} from "./bots/price_bot";
import {SendingBot} from "./bots/send_bot";
import {AnalyzeBot} from "./bots/analyze_bot";
import * as fs from "fs";

export class MainBot {

	private priceBot: PriceBot;
	private analyzeBot: AnalyzeBot;
	private sendingBot: SendingBot;
	private databaseService: DatabaseService;

	constructor() {
		this.priceBot = new PriceBot();
		this.analyzeBot = new AnalyzeBot();
		this.sendingBot = new SendingBot();
		this.databaseService = new DatabaseService();
	}

	public startProcessing(): void {
		this.databaseService.init()
			.then(() => this.priceBot.run()
			.then(() => this.analyzeBot.run()
			.then(() => this.sendingBot.run()
			.then(() => this.databaseService.close())
				.catch(err => console.error(err)))
				.catch(err => console.error(err)))
				.catch(err => console.error(err)))
				.catch(err => console.error(err));
	}

	public initEnvironmentVariables(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const path = __dirname + '/data/tokens.json';

			try {
				if (fs.existsSync(path)) {
					console.log('Token exist');
					fs.readFile(path, 'utf-8', (err, data) => {
						let tokens = JSON.parse(data.toString());
						process.env.tiingi_token = tokens['tiingi_token'];
						process.env.slack_webhooks = tokens['slack_webhooks'];
						process.env.german_token = tokens['german_token'];
						process.env.mongodb_user = tokens['mongodb_user'];
						process.env.mongodb_password = tokens['mongodb_password'];
						resolve();
					});
				} else {
					console.log("Use default environment variables. Tokens don't exist.");
					resolve();
				}
			} catch(err) {
				console.log("Use default environment variables. Error during processing.");
				reject('Error during processing process environment');
			}
		});
	}
}