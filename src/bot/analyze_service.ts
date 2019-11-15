import { Metric }  from './utils/metrics';

export class AnalyzeService {

	private MEDIAN_PERCENT: number = 0.15;
	private AVERAGE_DAYS: number = 10;
	private VOLUME_INCREASE_RATIO: number = 2;
	private DAILY_CHANGE_RATIO: number = 0.02;
	private HOLE_CHANGE: number = 0.02;

	private metric: Metric;

	constructor() {
		this.metric = new Metric();
	}

	private checkIfAnyTrue(result: object): boolean{
		return Object.keys(result).some( key => result[key]);
	}
	/**
	 * Check if current value is in low group of yearly median values.
	 */
	private medianLowPercent(todaysValue: object, allValues: Array<object>): boolean {
		return  this.metric.medianLowPercent(todaysValue, allValues, this.MEDIAN_PERCENT);
	}
	/**
	 * Check if today was bottom intersection of mean. If yesterday value was under average value and today is upper then true.
	 */
	private bottomIntersectionOfMean(allValues: Array<object>): boolean {
		return this.metric.bottomIntersectionOfMeanByDays(allValues, this.AVERAGE_DAYS, 1);
	}
	/**
	 * Check if 20 days mean was bottom intersection of 5 days mean.
	 */
	private bottomIntersectionOfMean5And20(allValues: Array<object>): boolean {
		return this.metric.bottomIntersectionOfMeanByDays(allValues, 20, 5);
	}
	/**
	 * Check if 200 days mean was bottom intersection of 50 days mean.
	 */
	private bottomIntersectionOfMean50And200(allValues: Array<object>): boolean {
		return this.metric.bottomIntersectionOfMeanByDays(allValues, 200, 50);
	}
	/**
	 * Check if volument increases today.
	 */
	private volumeIncrease(allValues: Array<object>): boolean {
		return this.metric.volumeIncrease(allValues, this.VOLUME_INCREASE_RATIO);
	}
	/**
	 * Check if today was big price raise.
	 */
	private dailyRaise(today: object): boolean {
		return this.metric.dailyRaise(today, this.DAILY_CHANGE_RATIO);
	}
	/**
	 * Check if today was big price fall.
	 */
	private dailyFall(today: object): boolean {
		return this.metric.dailyFall(today, this.DAILY_CHANGE_RATIO);
	}
	/**
	 * Check if between today and yesterday was hole on chart.
	 */
	private holeInChart(allValues: Array<object>): boolean {
		return this.metric.holeInChart(allValues, this.HOLE_CHANGE);
	}

 	public anaylzeCompany(allValues: Array<any>, todaysValue: object): object {

		let result =  {
				medianLowPercent: this.medianLowPercent(todaysValue, [...allValues]),
				bottomIntersectionOfMean: this.bottomIntersectionOfMean([...allValues]),
				bottomIntersectionOfMean5And20: this.bottomIntersectionOfMean5And20([...allValues]),
				bottomIntersectionOfMean50And200: this.bottomIntersectionOfMean50And200([...allValues]),
				volumeIncrease: this.volumeIncrease([...allValues]),
				dailyRaise: this.dailyRaise(todaysValue),
				dailyFall: this.dailyFall(todaysValue),
				holeInChart: this.holeInChart([...allValues])
			};


		result['anyLow'] = this.checkIfAnyTrue(result);

		return result;
	}
}