import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    username: 'root',
    password: '995528',
    database: 'staynest',
    host: 'localhost',
    dialect: 'mysql',
    logging: true,
});

export default sequelize;
