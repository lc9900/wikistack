const Sequelize = require('sequelize');
const database = process.env.DATABASE_URL || 'postgres://localhost/wikistackdb';
const connection = new Sequelize(database);
const utils = require('../utils');
const marked = require('marked');

connection.authenticate()
    .then(() => {
        utils.inform(`Connected to ${database}`);
    })
    .catch(error => {
        utils.alert(`Error: ${error.message}`);
    });

const User = connection.define('user',{
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        valide: {
            isEmail: true
        },
        allowNull: false
    }
});

const Page = connection.define('page',{
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM,
        values: ['open', 'closed']
    },
    dates: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
    }
}, {
        getterMethods:{
            route(){
                return  '/wiki/' + this.urlTitle;
            },
            renderedContent(){
                return marked(this.content);
            }
        },
        setterMethods:{},
        hooks:{
            beforeValidate: (page) => {
                // title manipulation
                if(page.title){
                    page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W+/g, '');
                }
                else page.urlTitle = Math.random().toString(36).substring(2, 7);
            } // End of beforeValidate
        }
});

Page.belongsTo(User, { as: 'author' }); // Adds authorId to page table

Page.prototype.findSimilar = function(tags) {
    // console.log('----------------------');
    // console.log(this);
    return Page.findAll({
        where: {
            tags: {
                $overlap: tags.split(" ")
            },
            id: {
                $ne: this.id
            }
        }
    }).then( result => {
        return result;
    }).catch(err => { throw err; });
};

const syncAndSeed = () => {
    return connection.sync({force: true}).then(() => {
        utils.inform('Database synced');
        seed();
    })
        .catch(err => { throw err; });
};

const seed = () => {
    return Promise.all([
                User.create({name: 'Default User', email: 'du@test.com'}),
                Page.create({title: 'Default Title', content: 'This is default content'})
                ])
        .then( () => { utils.inform('Database Seeded'); })
        .catch(err => { throw err; });
};

const findAllPages = () => {
    return Page.findAll()
            .then(result => { return result; })
            .catch((err) => { throw err; });
};

const findAllUsers = () => {
    return User.findAll()
            .then(result => { return result; })
            .catch((err) => { throw err; });
};

const findAllPagesByUserId = (id) => {
    return Page.findAll({
        where: {
            authorId: id
        }
    }).then(result => {
        return result;
    }).catch((err => { throw err; }));
};

const findOneUserById = (id) => {
    return User.findOne({
        where: {
            id: id
        }
    }).then(result => {
        return result;
    }).catch(err => { throw err; });
};

const findAllPagesByTags = (tags) => {
    return Page.findAll({
        where: {
            tags: {
                $overlap: tags.split(" ")
            }
        }
    }).then( result => {
        return result;
    }).catch(err => { throw err; });
};

module.exports = {
    sync: syncAndSeed,
    findAllPages,
    findAllUsers,
    findOneUserById,
    findAllPagesByTags,
    findAllPagesByUserId,
    models: {
        Page,
        User
    }
}

// Test Code
// sync().then(() => { console.log("Synced")})
//     .catch(err => {
//         console.log(err);
//     });

// sync();
// seed();

