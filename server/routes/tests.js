const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Joi = require('joi');
const bcrypt = require('bcrypt');

// MIDDLEWARES

router.use((req, res, next) => {
    //console.log('REQUEST MADE TO /api/tests ROUTE');
    next();
})


// ROUTES

/**
 * Test route to generate hashed pwd
 * POST => api/tests/generate_hash_pwd
 */
router.post('/generate_hash_pwd', (req, res, next) => {

    console.log(req.body.pwd);
    bcrypt.hash(req.body.pwd, 10, function (err, hash) {

        if (err) {
            res.status(400).json({error: err});
        } else {
            res.status(400).json({"pwd": req.body.pwd, "hash": hash});
        }
    })
});

/**
 * Test route to generate token
 * GET => api/tests/generate_token
 */
router.post('/generate_token', (req, res, next) => {

    require('crypto').randomBytes(48, function (err, buffer) {
        let token = buffer.toString('hex');
        res.status(200).json({"Token": token})
    });

});

module.exports = router;
