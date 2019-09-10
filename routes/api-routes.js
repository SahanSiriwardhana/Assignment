var express = require('express');
var router = express.Router();
// Import user controlle
var userController = require('../controllers/userController');
/* GET login page. */
router.get('/', function(req, res, next) {
  res.json({
    status: 'API Its Working',
    message: 'Welcome to sahan'
});
});

// user routes
router.route('/users')
    .get(userController.index)
    .post(userController.new);

    //view user
router.route('/users/:email/:password')
    .get(userController.view);
module.exports = router;