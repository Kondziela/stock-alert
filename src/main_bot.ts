import { DatabaseService } from './database/database_service';
import {PriceBot} from "./bots/price_bot";
import {SendingBot} from "./bots/send_bot";
import {AnalyzeBot} from "./bots/analyze_bot";
import * as fs from "fs";
import * as path from 'path';
import {TwitterStreamBot} from "./bots/twitter_stream_bot";
import {DBCleanerBot} from "./bots/db_cleaner_bot";
import {Logger} from "./utils/logger";

export class MainBot {

	private priceBot: PriceBot;
	private analyzeBot: AnalyzeBot;
	private sendingBot: SendingBot;
	private twitterStreamBot: TwitterStreamBot;
	private dbCleanerBot: DBCleanerBot;
	private databaseService: DatabaseService;
	private logger: Logger;

	constructor() {
		this.priceBot = new PriceBot();
		this.analyzeBot = new AnalyzeBot();
		this.twitterStreamBot = new TwitterStreamBot();
		this.sendingBot = new SendingBot();
		this.dbCleanerBot = new DBCleanerBot();
		this.databaseService = new DatabaseService();
		this.logger = new Logger();
	}

	public startProcessing(): void {
		this.databaseService.init()
			.then(() => this.priceBot.run()
			.then(() => this.analyzeBot.run()
			.then(() => this.sendingBot.run()
			.then(() => this.databaseService.close())
				.catch(err => this.logger.log(err)))
				.catch(err => this.logger.log(err)))
				.catch(err => this.logger.log(err)))
				.catch(err => this.logger.log(err));
	}

	public startTwitterStreamBot(): void {
		this.databaseService.init()
			.then(() => this.twitterStreamBot.run())
			.catch(err => this.logger.log(err));
	}

	public startDBCleanerBot(): void {
		this.databaseService.init()
			.then(() => this.dbCleanerBot.run()
			.then(() => this.databaseService.close())
				.catch(err => this.logger.log(err)))
				.catch(err => this.logger.log(err));
	}

	public static initEnvironmentVariables(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const tokenPath = path.join(__dirname, 'data', 'tokens.json');

			try {
				if (fs.existsSync(tokenPath)) {
					console.log('Token exist');
					fs.readFile(tokenPath, 'utf-8', (err, data) => {
						let tokens = JSON.parse(data.toString());
						// Access to Stock Trade API
						process.env.tiingi_token = tokens['tiingi_token'];
						process.env.german_token = tokens['german_token'];
						// Slack settings
						process.env.slack_webhooks = tokens['slack_webhooks'];
						// Twitter settings
						process.env.consumer_key = tokens['consumer_key'];
						process.env.consumer_secret = tokens['consumer_secret'];
						process.env.access_token = tokens['access_token'];
						process.env.access_token_secret = tokens['access_token_secret'];
						// turn off logging
						process.env.aws_environment = "";
						// database access
						process.env.database_name = tokens['database_name'];
						process.env.db_username = tokens['db_username'];
						process.env.db_password = tokens['db_password'];
						process.env.db_host = tokens['db_host'];
						process.env.db_port = tokens['db_port'];
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