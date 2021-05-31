const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Joi = require('joi');


// MIDDLEWARES

router.use((req, res, next) => {
    console.log('REQUEST MADE TO /api/project ROUTE');
    next();
})


// ROUTES

/**
 * Project create route
 * PUT => api/project/create
 *
 *    Require valid user_id, user_token, project_name, project_description, project_status
 */
router.put('/create', async (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number().required(),
        user_token: Joi.string().required(),
        project_name: Joi.string().required(),
        project_description: Joi.string().required(),
        project_status: Joi.number().required()
    });
    let joiResult = schema.validate(req.body);

    if (joiResult.error) {
        /** Joi can't validate data **/
        res.status(401).json({error: true, msg: joiResult.error.message, content: {}});
    } else {

        db.query("SELECT token FROM users WHERE id = ?", req.body.user_id, (err, result, field) => {
            if (result[0].token === req.body.user_token) {
                require('crypto').randomBytes(48, function (err, buffer) {
                    let token = buffer.toString('hex');
                    db.query(
                        "INSERT INTO project SET ?;",
                        {
                            name: req.body.project_name,
                            active: 1,
                            description: req.body.project_description,
                            status_id: req.body.project_status,
                            token: token
                        },
                        (err, sqlResult, field) => {
                            if (err) {
                                res.status(401).json({error: true, msg: err, content: {}});
                            }
                            else {
                                let {insertId} = sqlResult;

                                db.query(
                                    "INSERT INTO users_has_project SET ?",
                                    {
                                        project_id: insertId,
                                        users_id: req.body.user_id
                                    },
                                    (err, sqlResult, field) => {
                                        if (err) {
                                            res.status(401).json({error: true, msg: err, content: {}});
                                        }
                                        else {
                                            res.status(201).json({
                                                error: false,
                                                msg: "Project created",
                                                content: {"project_id": insertId, "project_token": token}
                                            })
                                        }
                                    }
                                )
                            }
                        }
                    )

                });
            }
            else {
                res.status(401).json({error: true, msg: "Wrong User Credentials", content: {result}});
            }
        })
    }
});


/**
 * Project update route
 * PATCH => api/project/update
 *
 *    Require valid project_id, project_token, project_name, project_description, project_status
 */
router.patch('/update', async (req, res, next) => {
    const schema = Joi.object({
        project_id: Joi.number().required(),
        project_token: Joi.string().required(),
        project_name: Joi.string().required(),
        project_description: Joi.string().required(),
        project_status: Joi.string().required(),
    });
    let joiResult = schema.validate(req.body);

    if (joiResult.error) {
        /** Joi can't validate data **/
        res.status(401).json({error: true, msg: joiResult.error.message, content: {}});
    } else {
        db.query(
            `
                UPDATE project 
                SET ?
                WHERE (id = ? && token = ? );`
            ,
            [
                {
                    name: req.body.project_name,
                    description: req.body.project_description,
                    status_id: req.body.project_status
                },
                req.body.project_id,
                req.body.project_token
            ],
            (err, updateResult, field) => {
                if (err) {
                    /** SQL Query error **/
                    res.status(401).json({error: true, msg: err, content: {}});
                } else {
                    let sqlInfo = updateResult.info;
                    let sqlId = updateResult.insertId;
                    res.status(202).json({
                        error: false,
                        msg: "Update successful",
                        content: {"project_id": sqlId, "info": sqlInfo}
                    });
                }
            }
        )
    }
});


/**
 * Tasks create route
 * DELETE => api/project/delete
 *
 *    Require valid project_id, project_token,
 */
router.delete('/delete', async (req, res, next) => {

    const schema = Joi.object({
        project_id: Joi.number().required(),
        project_token: Joi.string().required(),
    });
    let joiResult = schema.validate(req.body);

    if (joiResult.error) {
        /** Joi can't validate data **/
        res.status(401).json({error: true, msg: joiResult.error.message, content: {}});
    } else {
        db.query(
            "UPDATE project SET active = 0 WHERE (id = ? && token = ?);",
            [req.body.project_id, req.body.project_token],
            (err, deleteResult, field) => {
                if (err) {
                    /** SQL Query error **/
                    console.log(err)
                    res.status(401).json({error: true, msg: err, content: {}});
                } else if (deleteResult.affectedRows === 0) {
                    res.status(401).json({error: true, msg: "Project not found", content: {"project_id": req.body.project_id}});
                } else {
                    res.status(200).json({
                        error: false,
                        msg: "Delete Successful",
                        content: {"info": deleteResult.info}
                    });
                }
            }
        )
    }
});

module.exports = router;
