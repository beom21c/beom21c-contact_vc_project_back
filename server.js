const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");
const sql = require("./app/models/db");
const app = express();
const bodyParser = require('body-parser')
const { createProxyMiddleware } = require('http-proxy-middleware');
const cookieParser = require('cookie-parser');


const setUpLoginRoute = require('./app/routes/member.routes');

app.use(express.static('public'));
app.use(cookieParser());

app.use(cors({
    origin: "*", // 출처 허용 옵션
    credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
}));
// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */


// simple route
app.get("/", (req, res) => {
    sql.query("SELECT * FROM member", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created tutorial: ", res);
    });

});


app.post("/registerMember", (req, res) => {
    const {company, name, id, pw, position, email, phone} = req.body;
    console.log(company, name, id, pw, position, email, phone,'???')
    sql.query("insert into member(company, name, id, pw, position, email, phone) values ? ", [[[company, name, id, pw, position, email, phone]]], (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result)
        res.status(200).json({
            data: result.rows,
        });
    });
});



setUpLoginRoute.login(app);


// set port, listen for requests
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});