'use strict'

var express = require('express');
var router = express.Router();
var net = require('net');
var prowo = require('../modules/prowo.js');

router.use(function(request, response, next) {
    
    prowo.lese(request, response, request.body.id);

});

module.exports = router;