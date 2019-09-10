User=require('../models/userModel');

// Handle index actions
exports.index = function(req, res) {
    User.get(function(err, users) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
         
            data: users
        });
    });
};

// Handle create user actions
exports.new = function(req, res) {
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    // user.phone = req.body.phone;// save the contact and check for errors
    user.save(function(err) {
        if (err)
            res.json(err);
        res.json({
            message: 'New user created!',
            data: user
        });
    });
};

// Handle view user info
exports.view = function (req, res) {
    User.find({"email":req.params.name,"password":req.params.password}, function (err, user) {
        if (err)
            res.send(err);
        res.json({
            message: 'User details loading..',
            data: user
        });
    });
};