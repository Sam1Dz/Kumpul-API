'use strict'

const time = require('moment');
const responses = require('../libraries/responses');

const users = require('../controllers/users');

module.exports = (app) => {
    // Test Function
    app.get('/api/v1/test', (req, res) => { responses.ok("API Connected Successfully", res); console.log("Test Function Requested at " + time().format('DD/MM/YYYY HH:mm:ss')); });

    // Users Function
    app.post('/api/v1/users/register', users.userRegister);
    app.post('/api/v1/users/login', users.userLogin);
}
