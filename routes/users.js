var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var User = require('../models/userModel');
var Joi = require('joi');
var jwt=require('jsonwebtoken');

//@route GET /users
//@desc Get all users
router.get('/', (req, res, next) => {
    User.find()
        .sort({ create_date: -1 })
        .then(users => res.json(users))
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

});

//@route POST /users/signup
//@desc Add new user
router.post('/signup', (req, res, next) => {
    const scheema = Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })

    Joi.validate(req.body, scheema, (err, result) => {
        if (err) {
            //console.log(err);
            return res.status(500).json({
                error: err
            });
        } else {
            User.find({
                email: req.body.email
            }, (err, previosEmail) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Error: server error',
                    });
                } else if (previosEmail.length > 0) {
                    return res.status(500).json({
                        message: 'Error: Account already exist',
                    });
                } else {



                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            res.status(500).json({
                                error: err
                            });
                        } else {
                            var user = new User({
                                name: req.body.name,
                                email: req.body.email,
                                password: hash
                            });
                            user.save()
                                .then(result => {
                                    console.log(result);
                                    res.status(201).json({
                                        message: "User Created"
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                });
                        }
                    })
                }

            });

        }
    })



});

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(404).json({
                    message: 'Auth fail'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth fail'
                    });
                }
                if (result) {
                  //-----------adding token -----------
                 const token= jwt.sign({
                    email:user[0].email,
                    userID:user[0]._id
                  },"secret",
                  {
                    expiresIn:"1h"
                  }
                  );
                    return res.status(200).json({
                        message: 'Auth Successfull',
                        token:token
                    });
                }
                return res.status(401).json({
                    message: 'Auth fail'
                });
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});



module.exports = router;