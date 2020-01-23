 export class Util {

	// 252 is max of range
	 public oneYearAgo(): string {
		let date = new Date();
		date.setFullYear(date.getFullYear() - 1);
		return date.toISOString().substring(0, 10);
	}

	public today(): string {
		return this.dateXDayAgo(0, new Date());
	}

	public yesterday(): string {
		return this.dateXDayAgo(1, new Date());
	}

	public dateXDayAgo(daysAgo: number, date: Date): string {
	 	let dateXAgo = new Date(date);
		dateXAgo.setDate(date.getDate() - daysAgo);
		return dateXAgo.toISOString().substring(0, 10);
	}

	public isDateToday(date: Date): boolean {
	 	let today = new Date();
	 	return date.getDate() === today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() === today.getFullYear();
	}
}