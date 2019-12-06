import {Sequelize} from "sequelize-typescript";

const sequelize = new Sequelize({
    database: 'cheeki-breeki',
    dialect: 'mysql',
    username: '',
    password: '',
    host: ''
});
console.log('Connect');
sequelize.query('select ssl_is_used()', {})
    .then((result) => {
        console.log(result[0].ssl_is_used);
    });