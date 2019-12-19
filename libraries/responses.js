'use strict'

const time = require('moment');

exports.ok = (message, res) => {
    const result = {
        error: false,
        message: message,
        iat : time().format('DD-MM-YYYY HH:mm:ss')
    };
    res.status(200);
    res.json(result);
    res.end();
}

exports.dataMapping = (message, data, res) => {
    let result = {
        data: data,
        error: false,
        message: message,
        iat : time().format('DD-MM-YYYY HH:mm:ss')
    };

    res.status(200);
    res.json(result);
    res.end();
}

exports.error = (message, detail, code, res) => {
    const result = {
        error: true,
        message: message,
        errorDetail: detail,
        iat : time().format('DD-MM-YYYY HH:mm:ss')
    };
    res.status(code);
    res.json(result);
    res.end();
}
