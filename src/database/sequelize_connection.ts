import {Sequelize} from "sequelize-typescript";
import * as mysql from 'mysql2/promise';
import * as fs from 'fs';

export class SequelizeConnection {

    private sequelize: Sequelize;

    public getConnection(): Promise<Sequelize> {
        return new Promise<Sequelize>((resolve, reject) => {
            if (!this.sequelize) {
                this.sequelize = new Sequelize({

                    models: [__dirname + '/models'],
                    dialectOptions: {
                        multipleStatements: true
                    }
                });
                this.sequelize.authenticate()
                    .then(() => {
                        console.log('Connect to Database');
                        resolve(this.sequelize)
                    })
                    .catch(err => {
                        console.error('Unable to connect to database');
                        reject(err)
                    });
            }
            return resolve(this.sequelize);
        });
    }

    public createDatabase() {
        mysql.createConnection({

        }).then(connection => {
            console.log('Connected to database');
            connection.query('CREATE DATABASE cheeki_breeki')
                .then(res => {
                    console.log('Database created');
                });
        });
    }

    public createTables() {
        fs.readFile(__dirname + '/scripts/create_tables.sql', (err, script) => {
            if (err) {
                console.error(err);
                return;
            }
            this.getConnection().then(sequelize =>
            {
                console.log(script.toString());
                sequelize.query(script.toString(), {})
                    .then(() => {
                        console.log('Tables created successfully');
                    });
        })
        });
    }

}


