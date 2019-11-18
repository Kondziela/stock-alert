import { Request } from './senders/request';
import { SlackSender } from './senders/slack_sender';
import { Util } from './utils/util';
import { Parser } from './utils/parser';
import { Sorter } from './utils/sorters';
import { AnalyzeService } from './analyze_service';
import { UserService } from './user_service';
import { DatabaseService } from './database/database_service';

/**
 * DEPRECATED
 * TODO[AKO]: to delete in next tasks
 */
export class Main {

	private request: Request;
	private slackSender: SlackSender
	private util: Util;
	private parser: Parser;
	private sorter: Sorter;
	private analyzeService: AnalyzeService;
	private userService: UserService;
	private databaseService: DatabaseService;

	constructor() {
		this.request = new Request();
		this.slackSender = new SlackSender();
		this.util = new Util();
		this.parser = new Parser();
		this.sorter = new Sorter();
		this.analyzeService = new AnalyzeService();
		this.userService = new UserService();
		this.databaseService = new DatabaseService();
	}

	private countMetrics(company: any, allValues: Array<any>): void {
		allValues.sort(this.sorter.sortByDateDesc);
	
		let todaysValue = allValues[0],
			anaylyze = this.analyzeService.analizeCompany([...allValues], todaysValue);

			console.log(`Result for company ${company.name}: `, anaylyze);
		if (anaylyze['anyLow']) {
			this.slackSender.sendToSlack(
				this.userService.slackMetricsResponse(company, [...allValues], todaysValue, anaylyze)
			);
		}
	}

	private processCompany = (company, requestFn, parsFn) => {

		requestFn.call(this, company.code, this.util.oneYearAgo())
			.then((body) => {
				this.countMetrics(company, parsFn.call(this, body));
			});
	}

	mainProcess = () => {
		// TODO[AKO]: change with structure
		//sendToSlack(user_service.watchingCompanies(companiesUSA.concat(companiesGermany)));
		this.slackSender.sendToSlack(this.userService.legend());
		this.slackSender.sendToSlack(this.userService.analyzePrefix());

		console.log('Init DB');
		this.databaseService.init();

		console.log('Start processing companies');
		this.databaseService.findByCountry("USA", (companiesUSA) => {
			console.log('Find USA companies', companiesUSA);
			companiesUSA.forEach(company => this.processCompany(company, this.request.requestForUSAStock, this.parser.parseTiingoResponse));
			console.log('Close DB');
			this.databaseService.close();
		});
		// TODO[AKO]: repair in bug
		// this.databaseService.findByCountry('Germany', (companiesGermany) => {
		// 	companiesGermany.forEach(company => this.processCompany(company, this.request.requestForGermanStock, this.parser.parseQuandlResponse));
		// 	this.databaseService.close();
		// });


	}

}