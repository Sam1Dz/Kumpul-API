'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const time = require('moment');
const app = express();
const routes = require('./routes/routes');

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
routes(app);

require('dotenv').config();

app.listen(process.env.SERVER_PORT, () => { console.log('Server started at PORT "' + process.env.SERVER_PORT + '" [' + time().format('DD/MM/YYYY HH:mm:ss') + ']') });
