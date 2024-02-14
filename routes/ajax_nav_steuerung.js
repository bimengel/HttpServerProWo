'use strict'

var express = require('express');
var router = express.Router();
var net = require('net');
var prowo = require('../modules/prowo.js');


router.use(function(request, response, next) {
   
    try {
        let jsonProWo;
        let len, i, id;
        let str;

        switch(request.body.type) {
        case 1:
            str = request.body.id + ';1;';
            break;
        case 2:
            str = request.body.id + ";2;" + request.body.status + ";";
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
                        if(jsonProWo.list[i].image === "(null)")
                            response.write('<div class="prowo_btn_img_pos"></div>');
                        else
                            response.write('<div class="prowo_btn_img_pos"><img src="' + jsonProWo.list[i].image + '" /></div>');
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
                response.write('<div data-role="ui-content" id="content">')
                for(i=0; i < len; i++) {
                    if(jsonProWo.list[i].prowotype === 1 || jsonProWo.list[i].prowotype === 2) { // Schalter ein/aus
                        response.write('<div class="prowo_btn" menu="' + jsonProWo.list[i].id + '"');
                        response.write(' type="button" prowotype="' + jsonProWo.list[i].prowotype + '">');
                        response.write('<div class="prowo_btn_img_pos"></div>'); // damit die Position des Textes bleibt
                        response.write('<div class="prowo_btn_text">' + jsonProWo.list[i].text + '</div>');
                        response.write('<div class="prowo_btn_schalten steuerung_btn_schalten" menu="' + jsonProWo.list[i].id + '" status="'+ jsonProWo.list[i].status + '">');
                        response.write('<img class="prowo_btn_ein"  src="../images/prowo_btn_ein.png"/>');
                        response.write('<img class="prowo_btn_aus ' + jsonProWo.list[i].id + '" src="../images/prowo_btn_aus.png"/>');
                        response.write('<img class="prowo_btn_rahmen"  src="../images/prowo_btn_rahmen.png"/>');
                        response.write('</div></div>');
                    }
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