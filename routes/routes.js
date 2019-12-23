'use strict'

const time = require('moment');
const jwt = require('jsonwebtoken');
const responses = require('../libraries/responses');

const users = require('../controllers/users');

module.exports = (app) => {
    // Test Function
    app.get('/api/v1/test', (req, res) => { responses.ok("API Connected Successfully", res); console.log("Test Function Requested at " + time().format('DD/MM/YYYY HH:mm:ss')); });

    // Users Function
    app.post('/api/v1/users/register', users.userRegister);
    app.post('/api/v1/users/login', users.userLogin);
    app.patch('/api/v1/users/edit/profile/:id', verifyJWT, users.userEdit);
}

function verifyJWT(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    console.log("Checking Token at " + time().format('DD/MM/YYYY HH:mm:ss'));

    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        
        jwt.verify(bearerToken, process.env.JWT_KEY, (err) => {
            if(err) {
                console.log(err);
                responses.error("Authentication Failed!", "ERROR_AUTHENTICATION", 200, res);
            } else {
                return next();
            }
        });
    } else {
        responses.error("Authentication Failed!", "ERROR_AUTHENTICATION", 200, res);
    }
}
