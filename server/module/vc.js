const express = require('express');
const passport = require('passport');
const router = express.Router();
const authJwt = require('../authJWT');
router.get('/test', authJwt, async function(req, res, next) {

    console.log('!!!')
        // var match = {}
        // if (user) {
        //     match = {liker: user.id};
        // }
        // const users = await User.find(
        // ).populate({path:'liked', match: match}).populate({path:'likes'}).sort({'likes': -1});
        res.status(200).json({test : '1234'});
});

module.exports = router;