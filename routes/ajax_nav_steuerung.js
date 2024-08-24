'use strict'

var express = require('express');
var router = express.Router();
var net = require('net');
var prowo = require('../modules/prowo.js');


router.use(function(request, response, next) {
   
    try {
        let jsonProWo;
        let len, i, id, value;
        let str;

        switch(request.body.type) {
        case 1:
            str = request.body.id + ';1;';
            break;
        case 2:
            i = request.body.status;
            str = request.body.id + ";2;" + i + ";";
            break;
        default:
            str ="";
            break;
        }
        prowo.queryProWo(str)
        .then( function(ret) {
            jsonProWo = JSON.parse(ret);
            switch(jsonProWo.type) { 
            case 1: // Schaltebene 1
                len= jsonProWo.list.length;
                response.write('<div data-role="ui-content" id="content">')
                for(i=0; i < len; i++) {
                    if(jsonProWo.list[i].prowotype === 1) { // Menüpunkt Button mit Schalter 
                        response.write('<div class="btn_steuerung_2" menu="' + jsonProWo.list[i].id + '"');
                        response.write(' type="button" prowotype="' + jsonProWo.list[i].prowotype + '">');
                        if(jsonProWo.list[i].image === "")
                            response.write('<div class="prowo_btn_img_placeholder"></div>');
                        else
                            response.write('<div class="prowo_btn_img"><img src="' + jsonProWo.list[i].image + '" /></div>');
                        response.write('<div class="prowo_btn_text">' + jsonProWo.list[i].text + '</div>');
                        if(jsonProWo.list[i].status !== "not") {
                            response.write('<div class="prowo_btn_schalten steuerung_btn_schalten" menu="' + jsonProWo.list[i].id + '" status="'+ jsonProWo.list[i].status + '">');
                            response.write('<img class="prowo_btn_ein"  src="../images/prowo_btn_ein.png"/>');
                            response.write('<img class="prowo_btn_aus ' + jsonProWo.list[i].id + '"  src="../images/prowo_btn_aus.png"/>');
                            response.write('<img class="prowo_btn_rahmen"  src="../images/prowo_btn_rahmen.png"/>');
                            response.write('</div>');
                        }
                    }
                    response.write('</div>');
                }
                response.end('</div>');
                break;
            case 2: // Schaltebene 2
                len= jsonProWo.list.length; 
                let status, value, strImage, pos;
                response.write('<div data-role="ui-content" id="content">')
                for(i=0; i < len; i++) {   
                    status = jsonProWo.list[i].status;
                    value = Math.trunc(status / 256);
                    switch (jsonProWo.list[i].prowotype)
                    {   case 1: // Schalter
                            response.write('<div class="prowo_btn" menu="');
                            break;
                        case 2: //  Schalter mit Schieber
                        case 4: // uds mit Schieber
                            response.write('<div class="prowo_btn_mitSchieber" menu="');
                            break;
                        case 3: // up / stop / down
                            response.write('<div class="prowo_btn_uds" menu="');
                            break;                       
                        default:
                            break;
                    }
                    response.write(jsonProWo.list[i].id + '"');
                    response.write(' type="button" prowotype="' + jsonProWo.list[i].prowotype + '">');
                    response.write('<div class="pos_slider">');                       
                    if(jsonProWo.list[i].image != "")
                    {   
                        strImage = jsonProWo.list[i].image;
                        pos = strImage.indexOf(".");
                        response.write('<img class="prowo_btn_img" '
                            + ' id="i_' + jsonProWo.list[i].id + '" src="../images/' + strImage.slice(0, pos) + '_' 
                            + status%256 + strImage.slice(pos) + '">');
                    }
                    else
                        response.write('<div class="prowo_btn_img_placeholder"></div>');
                    response.write('<div class="prowo_btn_text">' + jsonProWo.list[i].text + '</div>');
                    switch (jsonProWo.list[i].prowotype) {
                        case 1: // nur ein/aus
                        case 2: // ein/aus mit Schieber 
                            response.write('<div class="prowo_btn_schalten steuerung_btn_schalten" menu="' + jsonProWo.list[i].id
                                + '" id="b_' + jsonProWo.list[i].id
                                + '" prowotype="' + jsonProWo.list[i].prowotype + '" status="'+ status + '">');                                 
                            response.write('<img class="prowo_btn_ein"  src="../images/prowo_btn_ein.png"/>');
                            response.write('<img class="prowo_btn_aus ' + jsonProWo.list[i].id + '" src="../images/prowo_btn_aus.png"/>');
                            response.write('<img class="prowo_btn_rahmen"  src="../images/prowo_btn_rahmen.png"/></div></div>');
                            break;
                        case 3: // up/stop/down
                        case 4: // up/stop/down mit Schieber
                            response.write('<div id="b_' + jsonProWo.list[i].id
                                + '" prowotype="' + jsonProWo.list[i].prowotype + '" status="' + status + '">');  
                            response.write('<img class="prowo_btn_up prowo_btn_updownstop"  status="1" src="../images/arrowdown.png"/>');
                            response.write('<img class="prowo_btn_stop prowo_btn_updownstop" status="2" src="../images/stop.png"/>');
                            response.write('<img class="prowo_btn_down prowo_btn_updownstop"  status="0" src="../images/arrowup.png"/></div></div>');  
                            break;                          
                        default:
                            response.write('</div></div>');
                            break;
                    }
                    switch (jsonProWo.list[i].prowotype) {
                        case 2:
                        case 4:
                            response.write('<input class="slider_steuerung" id="s_' + jsonProWo.list[i].id 
                                        + '" type="range" min="1" max="' + jsonProWo.list[i].max + '" value="' + value + '"/>');
                            break;
                        default:
                            break;
                    }  
                    response.write('</div>');
                }
                response.end('</div>');
                break;
            case 3: // Steuerung Rückmeldung auf eine Schalterbetätigung
                response.end('');
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