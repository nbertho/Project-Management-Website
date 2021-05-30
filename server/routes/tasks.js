const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Joi = require('joi');


// MIDDLEWARES

router.use((req, res, next) => {
    //console.log('REQUEST MADE TO /api/task ROUTE');
    next();
})


// ROUTES

/**
 * Tasks detail route
 * POST => api/task/show
 *
 *    Require valid project_id and project_token
 */
router.post('/show', async (req, res, next) => {

    const schema = Joi.object({
        project_id: Joi.number().required(),
        project_token: Joi.string().required()
    });
    let joiResult = schema.validate(req.body);

    if (joiResult.error) {
        /** Joi can't validate data **/
        res.status(401).json({error: true, msg: joiResult.error.message, content: {}});
    } else {
        let projectId = req.body.project_id;
        let projectToken = req.body.project_token;
        db.query(
            "SELECT tasks.id, tasks.token, tasks.name, tasks.description, tasks.estimated_time, tasks.status_id, tasks.parent_tasks_id, tasks.priority, tasks.is_parent FROM tasks JOIN project on tasks.project_id = project.id WHERE tasks.project_id = ? && project.token = ?",
            [projectId, projectToken],
            (err, taskResult, field) => {
                if (err) {
                    /** SQL Query error **/
                    res.status(401).json({error: true, msg: err, content: {}});
                } else {
                    res.status(200).json({error: false, msg: "", content: {"tasks": taskResult}});
                }
            }
        );
    }

});


/**
 * Tasks create route
 * PUT => api/task/create
 *
 *    Require valid project_id, project_token, task_name, task_parent
 *    Optional task_description, task_et
 */
router.put('/create', async (req, res, next) => {
    const schema = Joi.object({
        project_id: Joi.number().required(),
        project_token: Joi.string().required(),
        task_name: Joi.string().required(),
        task_parent: Joi.number(),
        task_description: Joi.string(),
        task_et: Joi.number()

    });
    let joiResult = schema.validate(req.body);

    if (joiResult.error) {
        /** Joi can't validate data **/
        res.status(401).json({error: true, msg: joiResult.error.message, content: {}});
    } else {
        db.query("SELECT token FROM project WHERE id = ?", req.body.project_id, (err, projectResult, field) => {
            if (projectResult[0].token == req.body.project_token) {
                require('crypto').randomBytes(48, function (err, buffer) {
                    let token = buffer.toString('hex');
                    db.query(
                        "INSERT INTO tasks SET ?;",
                        {
                            name: req.body.task_name,
                            description: req.body.task_description,
                            token: token,
                            estimated_time: req.body.task_et,
                            project_id: req.body.project_id,
                            parent_tasks_id: req.body.parent_tasks_id,
                            status_id: 1
                        },
                        (err, sqlResult, field) => {
                            if (err) {
                                res.status(401).json({error: true, msg: err, content: {}});
                            } else {
                                let {insertId} = sqlResult;
                                res.status(201).json({
                                    error: false,
                                    msg: "Task created",
                                    content: {"task_id": insertId, "task_token": token}
                                })
                            }
                        }
                    )
                });
            } else {
                res.status(401).json({error: true, msg: "Wrong Project Credentials", content: {}});
            }
        })
    }
});


/**
 * Tasks update route
 * PATCH => api/task/update
 *
 *    Require valid project_id, project_token, task_name, task_parent
 *    Optional task_description, task_et
 */
router.patch('/update', async (req, res, next) => {
    const schema = Joi.object({
        task_id: Joi.number().required(),
        task_token: Joi.string().required(),
        task_name: Joi.string().required(),
        task_parent: Joi.number().required(),
        task_description: Joi.string().required(),
        task_et: Joi.number().required(),
        status_id: Joi.number().required()
    });
    let joiResult = schema.validate(req.body);

    if (joiResult.error) {
        /** Joi can't validate data **/
        res.status(401).json({error: true, msg: joiResult.error.message, content: {}});
    } else {
        db.query(
            `
                UPDATE tasks 
                SET 
                name = ?,
                description = ?,
                estimated_time = ?,
                status_id = ?,
                parent_tasks_id = ?
                WHERE (id = ? && token = ? );`
            ,
            [
                req.body.task_name,
                req.body.task_description,
                req.body.task_et,
                req.body.status_id,
                req.body.task_parent,
                req.body.task_id,
                req.body.task_token
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
                        content: {"taskId": sqlId, "info": sqlInfo}
                    });
                }
            }
        )
    }
});


/**
 * Tasks status update route
 * PATCH => api/task/update/status
 *
 *    Require valid task_id, task_token, status_id
 */
router.patch('/update/status', async (req, res, next) => {
    const schema = Joi.object({
        task_id: Joi.number().required(),
        task_token: Joi.string().required(),
        status_id: Joi.number().required()
    });
    let joiResult = schema.validate(req.body);

    if (joiResult.error) {
        /** Joi can't validate data **/
        res.status(401).json({error: true, msg: joiResult.error.message, content: {}});
    } else {
        db.query(
            `
                UPDATE tasks 
                SET status_id = ?
                WHERE (id = ? && token = ? );`
            ,
            [
                req.body.status_id,
                req.body.task_id,
                req.body.task_token
            ],
            (err, updateResult, field) => {
                if (err) {
                    /** SQL Query error **/
                    res.status(401).json({error: true, msg: err, content: {}});
                } else {
                    let sqlInfo = updateResult.info;
                    res.status(202).json({
                        error: false,
                        msg: "Update successful",
                        content: {"taskId": req.body.status_id, "info": sqlInfo}
                    });
                }
            }
        )
    }
});


/**
 * Tasks create route
 * DELETE => api/task/delete
 *
 *    Require valid task_id, task_token,
 */
router.delete('/delete', async (req, res, next) => {

    const schema = Joi.object({
        task_id: Joi.number().required(),
        task_token: Joi.string().required(),
    });
    let joiResult = schema.validate(req.body);

    if (joiResult.error) {
        /** Joi can't validate data **/
        res.status(401).json({error: true, msg: joiResult.error.message, content: {}});
    } else {
        db.query(
            "DELETE FROM tasks WHERE (id = ? && token = ?);",
            [req.body.task_id, req.body.task_token],
            (err, deleteResult, field) => {
                if (err) {
                    /** SQL Query error **/
                    res.status(401).json({error: true, msg: err, content: {}});
                } else if (deleteResult.affectedRows === 0) {
                    res.status(401).json({error: true, msg: "Task not found", content: {"task_id": req.body.task_id}});
                } else {
                    console.log(deleteResult);
                    res.status(200).json({
                        error: false,
                        msg: "Delete Successfull",
                        content: {"info": deleteResult.info}
                    });
                }
            }
        )
    }
});

module.exports = router;
