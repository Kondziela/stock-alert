export class Sorter {

	// today -> all[length - 1]
	public sortByDateAsc(a: any, b: any): number {
		let bigger: number = a.date > b.date ? 1 : 0;
		return bigger * 2 - 1;
	}

	// today -> all[0]
	public sortByDateDesc(a: any, b: any): number {
		let smaller: number = a.date < b.date ? 1 : 0;
		return smaller * 2 - 1;
	}

	public sortByCloseDesc(a: any, b: any): number {
		let smaller: number = a.close < b.close ? 1 : 0
		return smaller * 2 - 1;
	}
}