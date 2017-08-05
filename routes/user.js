const router = require('express').Router();
const db = require('../models');
module.exports = router;

router.get('/', (req, res, next) => {
    db.findAllUsers()
        .then(users => {
            res.render('users', {users});
        })
        .catch(next);
});

router.get('/:id', (req, res, next) => {
    var id = parseInt(req.params.id);
    Promise.all([
                    db.findOneUserById(id),
                    db.findAllPagesByUserId(id)
                ]).then(result => {
                    res.render('user', {
                        user: result[0],
                        pages: result[1]
                    });
                }).catch(next);
});
