import { Metric } from './utils/metrics';

export class UserService {

	private metric: Metric;

	constructor() {
		this.metric = new Metric();
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
	public analyzePrefix(): string {
		return "Company with relative low yearly price:";
	}
	public legend(): string { 
		return "Legend:\n\r" +
		" - :moneybag: - in low percent of yearly median\n\r" + 
		" - :chart_with_upwards_trend: - bottom intersetion of todays, 5 days or 50 days mean\n\r" + 
		" - :candle: - unique candle event\n\r" +
		" - :man-boy-boy: - volume increase\n\r" +
		" - :arrow_up: - big price raise\n\r" +
		" - :arrow_down_small: - big price fall\n\r" +
		" - :hole: - hole on chart\n\r" +
		" - :green_heart:/:red_circle: - probably raise/fall";
	}

}
