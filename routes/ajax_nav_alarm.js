'use strict'

var express = require('express');
var router = express.Router();
var net = require('net');
var prowo = require('../modules/prowo.js');


router.use(function(request, response, next) {
    try {
        let jsonProWo;
        let str;
        let len, i, iAlarm;

        str = request.body.id + ";" + request.body.type + ";";
        if(request.body.type == 3)
            str += request.body.password + ";";
        prowo.queryProWo(str)
        .then( function(ret) {
            jsonProWo = JSON.parse(ret);
            switch(jsonProWo.type) {
            case 1:
                response.write('<div data-role="ui-content" id="content">');  
                if(jsonProWo.strError != "")
                {
                    response.write('<div class="alarm_1" menu="4_0_0_1">');
                    response.write('<h4>' + jsonProWo.strError + '</h4></div>');
                }            
                len = jsonProWo.alarm.length;
                switch(jsonProWo.status) {
                case 0:
                    for(i=0; i < len; i++)
                    {
                        if(jsonProWo.alarm[i].sensor == 1)
                        {
                            response.write('<div class="btn_alarm_1" menu="' + jsonProWo.alarm[i].id + '">' + jsonProWo.alarm[i].name);
                            response.write('<div class="prowo_btn_schalten btn_alarm_2" status="0">')
                            response.write('<img src="../images/prowo_btn_aus.png"/>');
                            response.write('<img class="prowo_btn_rahmen"  src="../images/prowo_btn_rahmen.png"/>');
                            response.write('</div></div>');                    
                        }
                        else
                            response.write('<div class="btn_alarm_1" menu="' + jsonProWo.alarm[i].id + '">' + jsonProWo.alarm[i].name + '</div>');
                    }
                    break;
                case 1:
                    for(i=0; i < len; i++)
                    {
                        if(i == 0)
                        {
                            response.write('<div class="btn_alarm_1" menu="' + jsonProWo.alarm[i].id + '">' + jsonProWo.alarm[i].name);
                            response.write('<div class="prowo_btn_schalten btn_alarm_2" status="1">')
                            response.write('<img src="../images/prowo_btn_ein.png"/>');
                            response.write('<img class="prowo_btn_rahmen"  src="../images/prowo_btn_rahmen.png"/>');
                            response.write('</div></div>'); 
                        }
                        else
                        {
                            if(jsonProWo.alarm[i].sensor == 1)
                            {
                                response.write('<div class="btn_alarm_1" menu="' + jsonProWo.alarm[i].id + '">' + jsonProWo.alarm[i].name);
                                response.write('<div class="prowo_btn_schalten btn_alarm_2" status="0">')
                                response.write('<img src="../images/prowo_btn_aus.png"/>');
                                response.write('<img class="prowo_btn_rahmen"  src="../images/prowo_btn_rahmen.png"/>');
                                response.write('</div></div>');  
                            }   
                            else
                                response.write('<div class="btn_alarm_1" menu="' + jsonProWo.alarm[i].id + '">' + jsonProWo.alarm[i].name + '</div>');
                        }                   
                    }
                    break;
                case 2:
                case 3:
                case 4:
                case 5:
                    iAlarm = jsonProWo.alarmnr;
/*                    for(i=0; i < len; i++)
                    {
                        if(i == 0)
                        {
                            response.write('<div class="btn_alarm_1" menu="' + jsonProWo.alarm[i].id + '">' + jsonProWo.alarm[i].name);
                            response.write('<div class="prowo_btn_schalten btn_alarm_2">')
                            response.write('<img src="../images/prowo_btn_ein.png"/>');
                            response.write('<img class="prowo_btn_rahmen"  src="../images/prowo_btn_rahmen.png"/>');
                            response.write('</div></div>'); 
                        }
                        else
                        {
                            if(iAlarm == i+1)
                            {
                                response.write('<div class="btn_alarm_1" menu="' + jsonProWo.alarm[i].id + '">' + jsonProWo.alarm[i].name);
                                response.write('<div class="prowo_btn_schalten btn_alarm_2">')
                                response.write('<img src="../images/prowo_btn_ein.png"/>');
                                response.write('<img class="prowo_btn_rahmen"  src="../images/prowo_btn_rahmen.png"/>');
                                response.write('</div></div>');  
                            } 
                            else
                                response.write('<div class="btn_alarm_1" menu="' + jsonProWo.alarm[i].id + '">' + jsonProWo.alarm[i].name + '</div>');
                        }   
                    }  
                    */ 
                    response.write('<div class="btn_alarm_1" menu="' + jsonProWo.alarm[iAlarm-1].id + '">' + jsonProWo.alarm[iAlarm-1].name);
                    response.write('<div class="prowo_btn_schalten btn_alarm_2">')
                    response.write('<img src="../images/prowo_btn_ein.png"/>');
                    response.write('<img class="prowo_btn_rahmen"  src="../images/prowo_btn_rahmen.png"/>');
                    response.write('</div></div>');                    
                    break;
                default:
                    break;
                }
                if(jsonProWo.history)
                {
                    response.write('<div class="btn_alarm_history" menu="' + jsonProWo.tage + '">Lichtprogramm ');
                    if(jsonProWo.tage != 0)
                        response.write('von vor ' + jsonProWo.tage + ' Tagen');
                    response.write('<div class="prowo_btn_schalten">')
                    if(jsonProWo.tage != 0)
                        response.write('<img src="../images/prowo_btn_ein.png"/>');
                    else
                        response.write('<img src="../images/prowo_btn_aus.png"/>');
                    response.write('<img class="prowo_btn_rahmen"  src="../images/prowo_btn_rahmen.png"/></div>');
                }
                response.end('</div>');
                break; 
            case 2:
                response.write('<div data-role="ui-content" id="content" class="btn_alarm_4" name="' + jsonProWo.name + '" ' + 
                                'status="' + jsonProWo.status + '" menu="' + jsonProWo.id + '">'); 
                response.write('<div class="prowo_home_alarm" align="middle" data-position="fixed"><fieldset class="ui-grid-a">' +
                               '<div class="ui-block-a"><input type="button" value="Zurück" id="zurueckAlarm" data-theme="a" ' +
                               'menu="' + jsonProWo.sensoren[0].id + '"></div>'+ 
                               '<div class="ui-block-b"><input type="button" id="actualizeAlarm" value="Aktualisieren" data-theme="b" ' +
                               'menu="' + jsonProWo.sensoren[0].id + '"></div></fieldset></div>');                                 
                len = jsonProWo.sensoren.length;
                for(i=0; i < len; i++)
                {
                    if(jsonProWo.sensoren[i].activated)
                    {
                        if(jsonProWo.sensoren[i].status == 0)
                        {
                            if(jsonProWo.sensoren[i].must == 1)
                                str = "backgrounderror";
                            else
                            str = "backgroundwarning";
                        }
                        else
                            str = "backgroundok";
                    }
                    else
                        str = "backgrounddisabled";
                    response.write('<div class="btn_alarm_3 ' + str + '" menu="' + jsonProWo.sensoren[i].id + '">');
                    response.write(jsonProWo.sensoren[i].name + '</div>');                    
                }
                response.end("</div>");
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