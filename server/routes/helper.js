const express = require('express');
const router = express.Router();
const db = require('../config/db');

// MIDDLEWARES

router.use((req, res, next) => {
    console.log('REQUEST MADE TO /api/helpers ROUTE');
    next();
})


// ROUTES

/**
 * Status Helper route
 * GET => api/helpers/status
 */
router.get('/status', async (req, res, next) => {

    db.query("SELECT * FROM status ORDER BY status.order ASC", (err, result, field) => {
        if (err) {
            /** SQL Query error **/
            res.status(401).json({error: true, msg: err, content: {}});
        } else {
            res.status(200).json({
                error: false,
                msg: "Status Data Available",
                content: {
                    status: result
                }
            });
        }
    })

});


module.exports = router;
