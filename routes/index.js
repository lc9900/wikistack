const router = require('express').Router();
// const userRouter = require('./user');
// const wikiRouter = require('./wiki');
const db = require('../models');
module.exports = router;

router.use('/wiki/', require('./wiki'));
router.use('/users/', require('./user'));

router.get('/', (req, res, next) => {
    db.findAllPages()
        .then(pages => {
            res.render('index', {pages});
            // res.json(pages);
        })
        .catch(next);
});

router.get('/search', (req, res, next) => {
    res.render('search');
});
