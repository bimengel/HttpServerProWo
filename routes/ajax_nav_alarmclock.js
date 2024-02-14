'use strict'

var express = require('express');
var router = express.Router();
var net = require('net');
var prowo = require('../modules/prowo.js');


router.use(function(request, response, next) {
    try {
        let jsonProWo;
        let str;
        let len, i, repeat;

        str = request.body.id + ";" + request.body.type + ";"
        switch(request.body.type) {
            case 2:
                str += request.body.status + ";";
                break;
            case 4:
                jsonProWo = JSON.parse(request.body.json);     
                str  += jsonProWo.name +  ";" + jsonProWo.repeat + ";" + jsonProWo.snooze + ";" + jsonProWo.time + ";" 
                     + jsonProWo.method + ";"  
                break;
            default:
                break;
        }
        prowo.queryProWo(str)
        .then( function(ret) {
            jsonProWo = JSON.parse(ret);
            switch(jsonProWo.type) {
            case 1:
                response.write('<div data-role="ui-content" id="content">');
                response.write('<div class="alarmclock_1"><img class="alarmclock_signplus" src="../images/signPlus.png"></div>');                
                len = jsonProWo.alarm.length;                
                for(i=0; i < len; i++)
                {
                    response.write('<div class="btn_alarmclock" menu="' + jsonProWo.alarm[i].id + '" type="button">');
                    response.write('<div class="alarmclock_uhr">' + jsonProWo.alarm[i].uhr + '</div>');
                    response.write('<div class="prowo_btn_schalten alarmclock_btn_schalten" menu="' + jsonProWo.alarm[i].id 
                                + '" status="'+ jsonProWo.alarm[i].activated + '">');
                    response.write('<img class="prowo_btn_ein"  src="../images/prowo_btn_ein.png"/>');
                    response.write('<img class="prowo_btn_aus ' + jsonProWo.alarm[i].id + '"  src="../images/prowo_btn_aus.png"/>');
                    response.write('<img class="prowo_btn_rahmen"  src="../images/prowo_btn_rahmen.png"/></div>');
                    response.write('<div class="alarmclock_name">' + jsonProWo.alarm[i].name + '</div>');
                    repeat = jsonProWo.alarm[i].repeat;
                    if(repeat) {
                        str = "";
                        if(repeat & 0x01)
                            str += "Mo ";
                        if(repeat & 0x02)
                            str += "Di ";
                        if(repeat & 0x04)
                            str += "Mi "
                        if(repeat & 0x08)
                            str += "Do ";
                        if(repeat & 0x10)
                            str += "Fr ";
                        if(repeat & 0x20)
                            str += "Sa ";
                        if(repeat & 0x40)
                            str += "So";
                        response.write('<div class="alarmclock_repeat">' + str +'</div>');
                    }
                    response.write('</div>');
                }               
                response.end('</div>');
                break;
            case 2: // Antwort auf Schalter
                response.end('');
                break;            
            case 3: // Datenabfrage für den Dialog
                response.write(ret);
                response.end('');
                break;  
            case 6: // ein Wecker ist aktiv
                response.write('<div data-role="ui-content" id="content">');
                response.write('<p class="alarmaktiv_uhr">' + jsonProWo.uhrzeit + '</p>')
                response.write('<p class="alarmaktiv_wecker">' + "WECKER " + jsonProWo.uhr + '</p>');
                response.write('<p class="alarmaktiv_wecker">' + jsonProWo.name + '</p>');
                if(jsonProWo.snooze == 'true')
                {
                    response.write('<p class="alarmaktiv_button"><input type="button" id="alarmaktiv_button_snooze" value="Schlummern"></p>');
                    response.write('<br><p class="alarmaktiv_button"><input type="button" value="Stopp" id="alarmaktiv_button_stopp"></p>');
                }
                else
                    response.write('<p class="alarmaktiv_button"><input type="button" value="Stopp" id="alarmaktiv_button_stopp"></p>');
                response.end('</div>')
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