import {MainBot} from "../main_bot";
import {Sequelize} from "sequelize";
var AWS = require('aws-sdk');

const DISABLE_SEQUELIZE_DEFAULTS = {
    timestamps: false,
    freezeTableName: true,
};


MainBot.initEnvironmentVariables().then(() => {
    AWS.config.update({
        accessKeyId: process.env.access_key_aws,
        secretAccessKey: process.env.secret_key_aws,
        region: process.env.region_aws
    });

    const sequelize = new Sequelize("dbname", "username", "password", {
        host: 'pgssltest.xxxxxxxxxxxx.region.rds.amazonaws.com',
        dialect: 'mysql',
        // TODO[AKO]: use cert for connection https://medium.com/soluto-nashville/best-security-practices-for-amazon-rds-with-sequelize-600a8b497804
        dialectOptions: {
            ssl: 'Amazon RDS'
        }
    });

});