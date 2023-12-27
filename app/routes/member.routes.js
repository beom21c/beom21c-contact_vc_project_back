// login.js
const jwt = require('jsonwebtoken');
const sql = require("../models/db");

const getUser = username => {
    return { username: 'zoala', password: '456456' };
};

const login = app => {
    app.post('/login', (req, res) => {
        const {id, pw} = req.body;

        // if (user.password !== password) {
        //     return res.status(401).send({ error: 'please check your password.' });
        // }


        sql.query("SELECT * FROM member WHERE id = ?", [id], (err, result, fields) => {
            if (err) {
                throw err;
            }

            if(result[0]?.pw === pw){

                // const token = jwt.sign(id, process.env.MY_SECRET, { expiresIn: '1h' }); // 토큰 생성
                // res.cookie('token', token);
                //
                res.status(200).json({
                    data: result, result : true
                });

            }else{
                res.status(200).json({
                    data: null, result : false
                });
            }

        });
    });
};

module.exports = { login };