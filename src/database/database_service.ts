import * as mongoose from 'mongoose';
import CompanyModel from './schema/company';

export class DatabaseService {

	private getDBUri(): string { 
		return `mongodb+srv://${process.env.mongodb_user}:${process.env.mongodb_password}@cluster0-iyhzw.mongodb.net/test?retryWrites=true&w=majority`
	}

	public init(): void {
		mongoose.connect(this.getDBUri(), { useCreateIndex: true, useNewUrlParser: true });
		mongoose.Promise = global.Promise;
	}

	public close(): void {
		mongoose.connection.close();
	}

	public findByCountry(country: string, callback: any): void {
		CompanyModel.find({country: country}, (err, docs) => {
			if (!err) {
				callback.call(this, docs);
			} else {
				console.log("Database connection error");
			}
		});
	}
}