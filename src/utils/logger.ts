import * as fs from 'fs';
import * as path from 'path';
import {Util} from "./util";

export class Logger {

    private LOG_DIR = path.join(process.cwd(), 'logs');
    private util: Util;

    constructor() {
        if (!process.env.aws_environment) {
            console.log(`Log DIR: ${this.LOG_DIR}`);
            if (!fs.existsSync(this.LOG_DIR)) {
                console.log('Created log dir');
                fs.mkdirSync(this.LOG_DIR);
            }
        }

        this.util = new Util();
    }

    public log(text: Object): void {
        if (!process.env.aws_environment) {
            fs.appendFile(path.join(this.LOG_DIR, `${this.util.today()}.log`), this.formatMessage(text), (err) => {
                if (err) {
                    console.error('Error when logging', err);
                }
            })
        }
    }

    private formatMessage(text: Object): String {
        return `${new Date().toISOString()}: ${JSON.stringify(text)}\n`;
    }
}