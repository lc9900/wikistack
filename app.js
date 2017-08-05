const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const db = require('./models');
const utils = require('./utils');
const port = process.env.PORT || 3000;



app.set('view engine', 'html');
app.engine('html', nunjucks.render);
var env = nunjucks.configure('views', {noCache: true, express: app});
var AutoEscapeExtension = require("nunjucks-autoescape")(nunjucks);
env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

db.sync()
    .then(() => {
        const server = app.listen(port, () => {
            utils.inform(`Server listening on port ${port}`);
        });
    })
    .catch(err => { utils.alert(err.message); });

app.use('/', require('./routes'));
// app.get('/', (req, res)=>{
//     res.render('index', {});
// })

app.use((err, req, res, next) => {
    res.render('error', {error: err});
})
