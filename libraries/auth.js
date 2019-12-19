const database = require('../databases/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

require('dotenv').config();

// Check Username Exists
exports.checkUsernameExists = (username, callback) => {
    database.query('SELECT COUNT(username) AS total FROM public.users WHERE username = $1', [username],
    (err, data) => {
        if (err) {
            return callback(err);
        } else {
            if(data.rows[0].total > 0) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        }
    });
}

// Register User
exports.createUser = (dataUser, callback) => {
    database.query('INSERT INTO public.users(username, password, email, otp, "emailVerified") VALUES ($1, $2, $3, $4, $5) RETURNING id', [dataUser.username, dataUser.newPassword, dataUser.email, 0, false],
    (err, data) => {
        if (err) {
            return callback(err);
        } else {
            database.query('INSERT INTO public.users_info(user_id, invite_id, name, status) VALUES ($1, $2, $3, $4)', [data.rows[0].id, dataUser.inviteId, dataUser.username, "Halo! Saya ada di Kumpul"],
            (err) => {
                if (err) {
                    return callback(err);
                } else {
                    callback(null, data.rows[0].id);
                }
            })
        }
    });
}

// Create JWT Token
exports.createJWT = (id, username, password) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ id, username, password }, process.env.JWT_KEY, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}

// Hash Password with Bcrypt
exports.hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds).then((hash) => { 
        return hash;
    });
}

// Check Password is Corect or Incorrect
exports.checkPassword = async (password, passwordDB) => {
    return await bcrypt.compare(password, passwordDB).then(function(res) {
        return res;
    });
}
