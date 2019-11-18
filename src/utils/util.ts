 export class Util {

	// 252 is max of range
	 public oneYearAgo(): string {
		let date = new Date();
		date.setFullYear(date.getFullYear() - 1);
		return date.toISOString().substring(0, 10);
	}

	public today(): string {
	 	return new Date().toISOString().substring(0, 10);
	}

	public findTodayObject(allValues: any, date: string): object {
		return allValues.reduce( (o1, o2) => o1.date == date ? o1 : o2 );
	}
}