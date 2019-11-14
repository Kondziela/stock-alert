export class Metric {
	private minElement(allValues: Array<any>, field: string): number{
		return allValues.reduce( (o1, o2) => o1[field] < o2[field] ? o1 : o2 );
	}
	private maxElement(allValues: Array<any>, field: string): number {
		return allValues.reduce( (o1, o2) => o1[field] > o2[field] ? o1 : o2 );
	}
	private averageValue(values: Array<any>, field: string): number {
		return values.map( value => value[field]).reduce( (a, b) => a + b, 0) / values.length;
	}
	private averageOfDays(values: Array<any>, days: number, offset: number): number {
		return this.averageValue(values.slice(0 + offset, days), 'close');
	}
	private bottomIntersectionOfMean(mainToday: number, mainYesterday: number, intersectionToday: number, intersectionYesterday: number): boolean {
		return mainYesterday > intersectionYesterday && mainToday < intersectionToday;
	}

	public generateSetMetrics(allValues: Array<any>, field: string): object {
		let min: number = this.minElement(allValues, field),
			max: number = this.maxElement(allValues, field);

			return {
				min: min,
				max: max
			}
	}
	public bottomIntersectionOfMeanByDays(allValues: Array<any>, mainCount: number, intersectionCount: number): boolean {
		let intersectionToday: 		number = this.averageOfDays(allValues, mainCount, 0),
			intersectionYesterday: 	number = this.averageOfDays(allValues, mainCount, 1),
			mainToday: 				number = this.averageOfDays(allValues, intersectionCount, 0),
			mainYesterday: 			number = this.averageOfDays(allValues, intersectionCount, 1);

		return this.bottomIntersectionOfMean(mainToday, mainYesterday, intersectionToday, intersectionYesterday);
	}
	public medianLowPercent(todayObject: any, allValues: Array<any>, percent: number): boolean {
		let index = allValues.findIndex((object) => object.date == todayObject.date);

		return (1 - (index/allValues.length)) < percent;
	}
	public volumeIncrease(allValues: Array<any>, ratio: number): boolean {
		let today = allValues[0],
			yesterday = allValues[1];

		return today.volume > yesterday.volume * ratio;
	}
	public dailyRaise(today: any, ratio: number): boolean {
		return today.close > (today.open + (today.open * ratio));
	}
	public dailyFall(today: any, ratio: number): boolean {
		return today.close < (today.open - (today.open * ratio));
	}
	public holeInChart(allValues: Array<any>, ratio: number): boolean {
		let todaysOpen = allValues[0].open,
			yesterdayClose = allValues[1].close;

		return todaysOpen > (1 + ratio) * yesterdayClose || todaysOpen < (1 - ratio) * yesterdayClose;
	}
}