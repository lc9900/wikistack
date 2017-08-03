const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const port = process.env.PORT || 3000;



app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', {noCache: true, express: app});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));
app.use(morgan('dev'));

const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.get('/', (req, res)=>{
    res.render('index', {});
})

app.use((err, req, res, next) => {
    res.render('error', {error: err});
})
