'use strict'

var express = require('express');
var router = express.Router();
var net = require('net');
var fs = require('fs');
var prowo = require('../modules/prowo.js');

/* GET home page. */
router.get('/', function(request, response, next) {
    
    prowo.lese(request, response, "0_0_0_0");

});


module.exports = router;
