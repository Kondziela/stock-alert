import { Metric } from './utils/metrics';
import {ActivityType} from "./bots/activity_type";
import {Util} from "./utils/util";

export class UserService {

	private metric: Metric;
	private util: Util;

	constructor() {
		this.metric = new Metric();
		this.util = new Util();
	}

	public slackResponse(companyAnalyzeList: Object): String {
		return [this.analyzePrefix()].concat(
			Object.keys(companyAnalyzeList).map(key => this.prepareResponseForCompany(key, companyAnalyzeList[key]))
		).join('\n\r');
	}

	private prepareResponseForCompany(company: string, companyActivities: Array<String>): String {
		return `${company}: ${companyActivities.map(this.createIconForActivity).join(" ")}`
	}

	private createIconForActivity(code: String): String {
		switch (code) {
			case ActivityType.PRICE_MEDIAN_LOW:
				return ":moneybag:";
			case ActivityType.BOTTOM_INTER_MEAN:
			case ActivityType.BOTTOM_INTER_MEAN_5_20:
			case ActivityType.BOTTOM_INTER_MEAN_50_200:
				return ":chart_with_upwards_trend:";
			case ActivityType.VOLUME_INCREASE:
				return ":man-boy-boy:";
			case ActivityType.DAILY_RAISE:
				return ":arrow_up:";
			case ActivityType.DAILY_FALL:
				return ":arrow_down_small:";
			case ActivityType.HOLE_IN_CHART:
				return ":hole:";
		}
	}

	public slackMetricsResponse(company: any, allValues: Array<any>,todaysValue: any, anaylyze: any): string {
		let measureMetric: any = this.metric.generateSetMetrics(allValues, "close"),
			slackString = `${company.name}: current: ${todaysValue.close}, min: ${measureMetric.min.close}, max: ${measureMetric.max.close}`;
	
		if (anaylyze.medianLowPercent) {
			slackString += " :moneybag:";
		}
		if (anaylyze.bottomIntersectionOfMean || anaylyze.bottomIntersectionOfMean5And20 || anaylyze.bottomIntersectionOfMean50And200) {
			slackString += " :chart_with_upwards_trend:";
		}
		if (anaylyze.volumeIncrease) {
			slackString += " :man-boy-boy:"
		}
		if (anaylyze.dailyRaise) {
			slackString += " :arrow_up:"
		}
		if (anaylyze.dailyFall) {
			slackString += " :arrow_down_small:"
		}
		if (anaylyze.holeInChart) {
			slackString += " :hole:"
		}
	
		console.log(`Found metrics for company ${company.name} ${measureMetric}`);
	
		return slackString;
	}
	
	public slackPredictionResponse(company, prediction: any): string {
		return `Tomorrow price prediction:\n\r regression: ${prediction.regression}`;
	}	
	public watchingCompanies(companies: Array<any>): string {
		return "Watching companies:\n\r" + companies.map(o => o.name).join(', ');
	}
	public analyzePrefix(): String {
		return `Analyze for date ${this.util.today()}:`;
	}
	public legend(): string { 
		return "Legend:\n\r" +
		" - :moneybag: - in low percent of yearly median\n\r" + 
		" - :chart_with_upwards_trend: - bottom intersetion of today, 5 days or 50 days mean\n\r" +
		" - :candle: - unique candle event\n\r" +
		" - :man-boy-boy: - volume increase\n\r" +
		" - :arrow_up: - big price raise\n\r" +
		" - :arrow_down_small: - big price fall\n\r" +
		" - :hole: - hole on chart\n\r" +
		" - :green_heart:/:red_circle: - probably raise/fall";
	}

}
