const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Joi = require('joi');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');


// MIDDLEWARES

router.use((req, res, next) => {
  console.log('REQUEST MADE TO /api/users ROUTE');
  next();
})


// ROUTES

/**
 * Login route
 * POST => api/user/login
 *
 *    Require valid mail and pwd in req.body
 */
router.post('/login', async (req, res, next) => {

  // Validate request body
  const schema = Joi.object({
    mail: Joi.string().email({tlds: {allow: false}}).required(),
    pwd: Joi.string().min(5).required()
  });
  let joiResult = schema.validate(req.body);

  if (joiResult.error) {
    let errorMessage = joiResult.error.message;
    /** Joi can't validate data **/
    res.status(401).json({error: true, msg: errorMessage, content: {}});
  }
  else {
    let password = req.body.pwd;
    db.query('SELECT * from users WHERE email LIKE ?;', req.body.mail, (err, result, field) => {
      if (result.length !== 1) {
        /** Query found more or less than 1 result found (more should not happened )**/
        res.status(401).json({error: true, msg: `${result.length} result(s) found`, content: {}});
      }
      else {
        dbPassword = result[0]["password"];
        dbUsername = result[0]["name"];
        dbEmail = result[0]["email"];
        dbId = result[0]["id"];
        bcrypt.compare(password, dbPassword).then((result) => {
          if (result) {
            db.query(
              'SELECT project_id, name, description, token FROM users_has_project JOIN project on users_has_project.project_id = project.id WHERE users_id = ?;',
              dbId,
              (err, projectResult, field) => {
                if (err) {
                  /** SQL Query error **/
                  res.status(401).json({error: true, msg: err, content: {}});
                }
                /** Successfull login **/
                res.status(200).json({
                  error: false,
                  msg: "Logging Successful",
                  content: {
                    userData: {
                      id: dbId,
                      username: dbUsername,
                      mail: dbEmail,
                    },
                    projectsData: {
                      projectResult
                    }
                  }
                });
              }
            );
          }
          else {
            /** Wrong credentials **/
            res.status(401).json({error: true, msg: "Wrong Credentials", content: {}});
          }
        });
      }
    })

  }

})

/**
 * Registration route
 * POST => api/user/register
 */
router.post('/register', async (req, res) => {
  const schema = Joi.object({
    mail: Joi.string().email({tlds: {allow: false}}).required(),
    name: Joi.string().min(3).required(),
    pwd: Joi.string().min(6).required()
  });
  let result = schema.validate(req.body);

  if (result.error) {
    /** Joi can't validate data **/
    res.status(400).json({error: true, msg: result.error.message , content: {}});
  }
  else {
    db.query('SELECT email from users WHERE email LIKE ?;', req.body.mail, (err, result, field) => {
      if (err) {
        /** SQL Query error **/
        res.status(200).json({error: true, msg: err, content: {}})
      }
      else {
        if (result.length === 0) {
          bcrypt.hash(req.body.pwd, 10, (err, hash) => {
            if (err) {
              /** Bcrypt error **/
              res.status(200).json({error: true, msg: err, content: {}});
            }
            else {
              db.query('INSERT INTO users SET ?', {email: req.body.mail, password: hash, name: req.body.name}, (err, insertResult, field) => {
                if (err) {
                  /** SQL Query error **/
                  res.status(401).json({error: true, msg: err, content: {}});
                }
                else {
                  let { insertId } = insertResult;
                  /** User successfully added to the DB **/
                  res.status(200).json({
                    error: false,
                    msg: "User created successfully",
                    content: {
                      userData: {
                        id: insertId,
                        username: req.body.name,
                        mail: req.body.mail
                      },
                    }
                  });
                }
              })
            }
          });
        }
        else {
          /** Email is already present in DB **/
          res.status(403).json({error: true, msg: "This email is already taken", content: {mail: req.body.mail}})
        }

      }
    })
  }
})

module.exports = router;
