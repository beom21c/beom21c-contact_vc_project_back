const express = require('express');
const db = require('../db');
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require('../jwt-util');
const randtoken = require('rand-token');
const authJwt = require("../authJWT");
const refresh = require("../refresh");


router.post('/companyInfo', authJwt, async function (req, res, next) {

    const {cid} = req.body;

    db.query('select * from companyInfo join team_member on companyInfo.cid = team_member.cid where companyInfo.cid = ? ', [cid], async (err, results) => {
        if (err) {
            return res.status(500).send('Database query error');
        }
        res.status(200).json(results);
    });

});


router.get('/getCompanyList', authJwt, async function (req, res, next) {

    db.query('select * from companyInfo', [], async (err, results) => {
        if (err) {
            return res.status(500).send('Database query error');
        }
        res.status(200).json(results);
    });

});


router.post('/registerNews', authJwt, async function (req, res, next) {

    const {title, link, contents, cid} = req.body;
    db.query('insert into news_list(title, link, news_contents,cid)  value(?,?,?,?)', [title, link, contents, cid], async (err, results) => {
        if (err) {
            return res.status(500).send('Database query error');
        }
        res.status(200).json({success: true, message: '뉴스등록이 완료되었습니다.'});
    });

});

router.get('/getCompanyList_with_news', authJwt, async function (req, res, next) {

    const {cid} = req.query;

    db.query('select * from companyInfo join team_member on companyInfo.cid = team_member.cid where companyInfo.cid = ? ', [cid], async (err, results) => {
        if (err) {
            return res.status(500).send('Database query error');
        }
        db.query('select * from news_list where cid = ?', [cid], async (err, news_result) => {
            if (err) {
                return res.status(500).send('Database query error');
            }
            res.status(200).json({companyInfo: results, newsList: news_result});
        });
    });
});


module.exports = router;