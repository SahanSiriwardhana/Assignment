var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    status: 'API Its Working',
    message: 'Welcome to RESTHub crafted with love!'
});
});

module.exports = router;
