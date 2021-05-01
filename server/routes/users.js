var express = require('express');
var router = express.Router();

// MIDDLEWARES
router.use((req, res, next) => {
  console.log('REQUEST MADE TO /api/users ROUTE');
  next();
})

router.get('/', (req, res, next) => {
  res.status(200).json({error: false, msg: 'Users root URL', content: {}});
})


module.exports = router;
