'use strict'

const time = require('moment');
const responses = require('../libraries/responses');
const database = require('../databases/connection');
const authLib = require('../libraries/auth');

// User Register
exports.userRegister = (req, res) => {
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let inviteId = time().format('DDYYMMmmHHss');

    if (email != "" && username != "" && password != "") {
        authLib.checkUsernameExists(username, (err, exists) => {
            if (err) {
                responses.error("Error while Getting Users Data!", "ERROR_REQUESTING_DATABASE", 500, res);
            } else {
                if (exists != true) {
                    authLib.hashPassword(password).then((newPassword) => {
                        let dataUser = {
                            username,
                            newPassword,
                            email,
                            inviteId
                        }
    
                        authLib.createUser(dataUser, async (err, idUser) => {
                            if (err) {
                                responses.error("Error while Inserting User Data!", "ERROR_REQUESTING_DATABASE", 500, res);
                            } else {
                                let result = {
                                    id : Number(idUser),
                                    username: username,
                                    token : await authLib.createJWT(idUser, username, password)
                                }
    
                                responses.dataMapping("Register Success!", result, res);
                            }
                        });
                    });
                } else {
                    responses.error("Username already exists", "USERNAME_EXISTS", 200, res);
                }
            }
        });
    } else {
        responses.error("Request body empty!", "EMPTY_REQUEST", 200, res);
    }

    console.log("Users Function (userRegister) Requested at " + time().format('DD/MM/YYYY HH:mm:ss'));
}

// User Login
exports.userLogin = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (username != "" && password != "") {
        authLib.checkUsernameExists(username, (err, exists) => {
            if (err) {
                responses.error("Error while Getting Users Data!", "ERROR_REQUESTING_DATABASE", 500, res);
            } else {
                if (exists === true) {
                    database.query('SELECT id, password FROM public.users WHERE username = $1', [username], (err, data) => {
                        if (err) {
                            responses.error("Error while Getting Users Data!", "ERROR_REQUESTING_DATABASE", 500, res);
                        } else {
                            authLib.checkPassword(password, data.rows[0].password).then( async (pass) => {
                                if (pass === true) {
                                    let token = await authLib.createJWT(data.rows[0].id, username, password);
                                    
                                    let result = {
                                        id : Number(data.rows[0].id),
                                        token : token
                                    }
    
                                    responses.dataMapping("Login Success!", result, res);
                                } else {
                                    responses.error("Password incorrect", "INCORRECT_PASSWORD", 200, res);
                                }
                            })
                        }
                    });
                } else {
                    responses.error("Username doesn't exists", "USERNAME_NOT_EXISTS", 200, res);
                }
            }
        });
    } else {
        responses.error("Request body empty!", "EMPTY_REQUEST", 200, res);
    }

    console.log("Users Function (userLogin) Requested at " + time().format('DD/MM/YYYY HH:mm:ss'));
}
