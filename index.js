const express = require('express');
const app = express();
const routesAdmin = require("./src/routes/admin");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');//địa chỉ của angular đc phép truy cập vô nodejs này
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,X-CSRF-Token,raw,JSON');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


routesAdmin(app);
require("dotenv").config({});

app.listen(process.env.PORT)