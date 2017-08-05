const router = require('express').Router();
const db = require('../models');
// const utils = require('../utils');
module.exports = router;

router.get('/', (req, res, next) => {
    res.redirect('/');
});

router.get('/add', (req, res, next) => {
    // res.send("<h1>Wiki add route</h1>");
    res.render('addpage', {});
});

router.post('/', (req, res, next) => {


    var user = db.models.User.findOrCreate({
        where: {
            name: req.body.user_name,
            email: req.body.user_email
        }
    })
        .then(function(result){
            // res.json(result);
            var user = result[0];
            var page = db.models.Page.build({
                title: req.body.title,
                content: req.body.content,
                status: req.body.status || 'open',
                tags: req.body.tags.split(" ")
            });
            return page.save().then(result => {
                return page.setAuthor(user) // In order to catch error, I have to return this promise
                            // .then(()=>{throw 'my error'}) // Tested here, with return, this error is captured.
                // return result;
                // res.redirect(result.route);
            });
        })
        .then(result => {
            res.redirect(result.route);
        })
        .catch(next);

    // Promise.all([
    //                 page.save(),
    //                 user.save()
    //             ])
    //     .then(result => {
    //         // res.render('wikipage', {title: page.title, content: page.content});
    //         // res.json(result);
    //         res.redirect(result[0].route);
        // }).catch(next);
    // res.json(utils.titleGen(req.body.title));
});

router.get('/search', (req, res, next) => {
    var tags = req.query.tags;
    db.findAllPagesByTags(tags)
        .then(pages => {
            res.render('index', {pages});
        }).catch(next);

});

router.get('/similar', (req, res, next) => {
    db.models.Page.findOne({
        where: {
            urlTitle: req.query.urlTitle
        }
    }).then(page => {
        // res.json(page);
        // console.log(page);
        return page.findSimilar(req.query.tags)
            .then(pages => {
                // res.json(pages);
                res.render('index', {pages});
            })
    }).catch(next);
});

router.get('/:urlTitle', (req, res, next) => {
    db.models.Page.findOne({
        where: {
            urlTitle: req.params.urlTitle
        },
        include: [{
            model: db.models.User,
            as: 'author'
            // model: db.models.User // Because the association is using alias author, we have to use author here as well
        }]
    })
        .then( page => {
            // page.getAuthor().then(result => { res.json(result)})
            // res.json(page);
            // res.locals.tags = page.tags.join(" ");
            res.locals.tags = page.tags.join("+");
            res.render('wikipage', {page});
        })
        .catch(next);
    // res.send(result);
});

