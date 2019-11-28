import {ActivityType} from "../database/activity_type";
import {Util} from "../utils/util";

export class UserService {

	private util: Util;

	constructor() {
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

	public analyzePrefix(): String {
		return `Analyze for date ${this.util.yesterday()}:`;
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
