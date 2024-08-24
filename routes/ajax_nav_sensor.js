'use strict'

var express = require('express');
var router = express.Router();
var net = require('net');
var prowo = require('../modules/prowo.js');


router.use(function(request, response, next) {
    try {
        let jsonProWo;
        let str;
        let len, i;

        str = request.body.id + ";" + request.body.type + ";";
        prowo.queryProWo(str)
        .then( function(ret) {
            jsonProWo = JSON.parse(ret);
            switch(jsonProWo.type) {
            case 1:
                len= jsonProWo.sensor.length;
                response.write('<div data-role="ui-content" id="content">')                
                for(i=0; i < len; i++)
                {
                    response.write('<div class="btn_sensor" menu="' + jsonProWo.sensor[i].id + '" type="button">');
                    response.write('<div><div class="sensor_text">' + jsonProWo.sensor[i].text + '</div>');
                    response.write('<div class="sensor_temp">' + jsonProWo.sensor[i].temp + '°C</div>');
                    if(jsonProWo.sensor[i].typ == 2) // TH1
                    {
                        response.write('<div class="sensor_humidity">' + jsonProWo.sensor[i].humidity + '%</div></div>');
                        response.write('<input class="slider_sensor" type="range" min="1" max="500" value="' 
                            + jsonProWo.sensor[i].VocSignal + '" disabled="true"/>');
                    }
                    else
                        response.write('</div>');   
                    response.write('</div>');                   
                }
                response.end('</div>');                
                break;
            case 2:
                response.write(ret);
                response.end('');            
                break;
            default:
                break;
            }
        });
    }
    catch (err){
        console.error(err.message);
        response.end(err.message);
    }
});

module.exports = router;