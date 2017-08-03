var Sequelize = require('sequelize');
var database = process.env.DATABASE_URL || 'postgres://localhost/wikistackdb';
var db = new Sequelize(database);

const User = db.define('user',{
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    }
});

const Page = db.define('page',{
    title: {
        type: Sequelize.STRING
    },
    urlTitle: {
        type: Sequelize.STRING
    },
    content: {
        type: Sequelize.TEXT
    },
    status: {
        type: Sequelize.BOOLEAN
    }
});

module.exports = {
    models: {
        Page,
        User
    }
}
