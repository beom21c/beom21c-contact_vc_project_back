const express = require('express');
const db = require('../db');
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require('../jwt-util');
const randtoken = require('rand-token');
const authJwt = require("../authJWT");
const refresh = require("../refresh");


router.post("/signup", (req, res) => {
    const {company, name, id, pw, position, email, phone, type} = req.body;

    db.query('select * from member where id = ?', [id], (err, results) => {

        if (err) {
            return res.status(500).send('Database query error');
        }
        if (results.length > 0) {
            return res.status(400).send('ID already exists');
        }
    bcrypt
        .genSalt(12)
        .then((salt) => {
            return bcrypt.hash(pw, salt);
        })
        .then((hash) => {
            db.query('insert into member(company, name, id, pw, position, email, phone, type)  value(?,?,?,?,?,?,?,?)', [company, name, id, hash, position, email, phone, type], (err, rows) => {
                if (err) {
                    return res.status(500).send('Error inserting data');
                }
                res.send('Data inserted successfully');
            });
            });
        })
});


/**
 * @description Login
 */
router.post('/signin', (req, res) => {
    const errors = {};
    const { id, pw} = req.body;
    db.query('select * from member where id = ? ', [id], async (err, results) => {

        if (err) {
            return res.status(500).send('Database query error');
        }
        if (!(results.length > 0)) {
            console.log('!!!!')
        }



        isMatch = await bcrypt.compare(pw, results[0].pw);
        if (!isMatch) {
            errors.message = "Password is incorrect";
            return res.status(400).json(errors);
        }

        const payload = {
            id: results[0].id,
            username: results[0].name
        };
        const accessToken = jwt.sign(payload);
        const refreshToken = jwt.refresh();

        if (!accessToken) {
            return res.status(500)
                .json({ error: "Error signing token",
                    raw: err });
        }

        res.status(200).send({ // client에게 토큰 모두를 반환합니다.
            ok: true,
            data: {
                accessToken,
                refreshToken,
            },
        });
    });
});


router.post('/me', authJwt, async function(req, res, next) {

    db.query('select * from member where id = ? ', [req.id], async (err, results) => {
        if (err) {
            return res.status(500).send('Database query error');
        }
        if (!(results.length > 0)) {
            console.log('!!!!')
        }
        const {company, name, id, position , email, phone, cid} = results[0];
        res.status(200).json({company, name, id, position , email, phone, cid});
    });

});

router.get('/refresh', refresh);


// router.get("/me", (req, res) => {
//     let value = req.query;
//     console.log(value,'val');
//     db.query('SELECT * FROM member where token = ?', [value.token], (err, rows) => {
//         if (err) {
//             throw err;
//         }
//         if(rows.length === 1){
//             let parameter = {
//                 userInfo : rows,
//                 resultType : 'success'
//             }
//             res.send(parameter);
//         }else{
//             let parameter = {
//                 resultType : 'fail'
//             }
//             res.send(parameter);
//         }
//     });
//
// });

// router.get("/myinfo", (req, res) => {
//     let value = req.query;
//     console.log(value.uid,'val');
//     db.query('SELECT * FROM member where uid = ?', [value.uid], (err, rows) => {
//         if (err) {
//             throw err;
//         }
//         res.send(rows);
//     });
// });


// router.post("/signup", (req, res) => {
//     let value = req.body;
//
//     db.query('insert into member(email, pw, name, tel, birth, sex, reg_date, id)  value(?,?,?,?,?,?,now(),?)', [value.email, value.pw, value.name, value.tel, value.birth, value.sex, value.id], (err, rows) => {
//         if (err) {
//             throw err;
//         }
//         let parameter = {
//             resultType : 'success'
//         }
//         res.send(parameter);
//
//     });
// });


module.exports = router;