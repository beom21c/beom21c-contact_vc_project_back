const express = require('express');
const db = require('../db');
const bcrypt = require("bcryptjs");
const router = express.Router();
const authJwt = require("../authJWT");

const axios = require('axios');
const cheerio = require('cheerio');
router.post('/companyInfo', authJwt, async function (req, res, next) {

    const {cid} = req.body;

    db.query('select * from companyInfo where cid = ? ', [cid], async (err, companyInfo) => {
        if (err) {
            return res.status(500).send('Database query error');
        }

        db.query('select * from team_member where cid = ? ', [cid], async (err, results) => {
            if (err) {
                return res.status(500).send('Database query error');
            }

            res.status(200).json({companyInfo : companyInfo[0], memberList : results});
        });

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



async function fetchTitleImage(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const ogImage = $('meta[property="og:image"]').attr('content');

        return ogImage || '이미지 없음';
    } catch (error) {
        console.error(error);
        return '오류 발생';
    }
}


router.get('/getCompanyList_with_news', authJwt, async function (req, res, next) {

    const {cid} = req.query;

    let companyInfo = null;
    let newsList = null;
    db.query('select * from companyInfo join team_member on companyInfo.cid = team_member.cid where companyInfo.cid = ? ', [cid], async (err, results) => {
        if (err) {
            return res.status(500).send('Database query error');
        }
        db.query('select * from news_list where cid = ?', [cid], async (err, news_result) => {
            if (err) {
                return res.status(500).send('Database query error');
            }


            async function processNewsResults(news_results) {
                const promises = news_results.map(v => {
                    return fetchTitleImage(v.link).then(imageUrl => {
                        return {...v, image: imageUrl};
                    });
                });

                return await Promise.all(promises);
            }
            processNewsResults(news_result).then(processedResults => {
                res.status(200).json({companyInfo: results, newsList: processedResults});
            },err =>{
                return res.status(500).send('Database query error');
            });
            // console.log(news_result[0],'news_result[0]:::')

        });
    });


});



router.post('/add_team_member', authJwt, async function (req, res, next) {

    const {name, part, position, cid} = req.body;

    db.query('insert into team_member(name, part, position,cid)  value(?,?,?,?)', [name, part, position, cid], async (err, results) => {
        if (err) {
            return res.status(500).send('Database query error');
        }
        res.status(200).json({success: true, message: '팀원 등록이 완료되었습니다.'});
    });

});

router.post('/get_team_memberInfo', authJwt, async function (req, res, next) {

    const {tid} = req.body;

    db.query('select * from team_member where tid = ? ', [tid], async (err, results) => {
        if (err) {
            return res.status(500).send('Database query error');
        }
        res.status(200).json(results[0]);
    });

});


router.post('/update_team_member', authJwt, async function (req, res, next) {

    const {name, part, position, tid} = req.body;


    db.query('update team_member set name = ?, part = ?, position = ? where tid = ?', [name, part, position, tid], async (err, results) => {
        if (err) {
            return res.status(500).send('Database query error');
        }
        res.status(200).json({success: true, message: '업데이트가 완료되었습니다.'});
    });

});

router.post('/delete_team_member', authJwt, async function (req, res, next) {

    const {tid} = req.body;


    db.query('delete from team_member where tid = ?', [tid], async (err, results) => {
        if (err) {
            return res.status(500).send('Database query error');
        }
        res.status(200).json({success: true, message: '삭제가 완료되었습니다.'});
    });

});




router.post('/update_company_info', authJwt, async function (req, res, next) {

    const {introduce , subIntroduce, investStep, investStepPrivate , investAmount , investAmountPrivate , businessType, sales, member_count, ceo, address, homepage, since, video_address, sns, acc_invest_amount, invest_count} = req.body;
    db.query('update companyInfo set introduce = ?, subIntroduce = ?, investStep = ?, investStepPrivate = ?, investAmount = ?, investAmountPrivate = ?, businessType = ?, sales = ?, member_count = ?, ceo = ?, address = ?, homepage = ?, since = ?, video_address = ?, sns = ?, acc_invest_amount = ?, invest_count = ?', [introduce , subIntroduce, investStep, investStepPrivate , investAmount , investAmountPrivate , businessType, sales, member_count, ceo, address, homepage, since, video_address, sns, acc_invest_amount, invest_count], async (err, results) => {
        if (err) {
            return res.status(500).send('Database query error');
        }
        res.status(200).json({success: true, message: '업데이트가 완료되었습니다.'});
    });

});






module.exports = router;