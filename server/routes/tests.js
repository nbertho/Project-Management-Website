const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Joi = require('joi');
const bcrypt = require('bcrypt');

// MIDDLEWARES

router.use((req, res, next) => {
    console.log('REQUEST MADE TO /api/tests ROUTE');
    next();
})



// ROUTES

/**
 * Test route
 * GET => api/tests/
 */
router.post('/generate_hash_pwd', (req, res, next) => {

    console.log(req.body.pwd);
    bcrypt.hash(req.body.pwd, 10, function(err, hash) {

        if (err) {
            res.status(400).json({error: err});
        }
        else {
            res.status(400).json({"pwd": req.body.pwd, "hash": hash});
        }
    })
}

);

module.exports = router;
