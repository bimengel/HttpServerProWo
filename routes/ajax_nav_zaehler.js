'use strict'

var express = require('express');
var router = express.Router();
var net = require('net');
var prowo = require('../modules/prowo.js');

router.use(function(request, response, next) {
    
    try {
        let jsonProWo;
        let str;
        let len, i, datum, tag, monat, jahr, iPos;

        str = request.body.id + ";" + request.body.type + ";";
        switch(request.body.type) {
            case 2: 
                str += request.body.datum + ";" + request.body.offset + ";";
                break;
            case 3: 
                break;
            case 4: 
                break;
            case 5: 
                break;
            case 6: 
                break;
            case 7: 
                break;
            case 8: 
                break;
            default:
                break;
        }
        prowo.queryProWo(str)
        .then( function(ret) {
            jsonProWo = JSON.parse(ret);
            switch(jsonProWo.type) {
            case 1:
                len= jsonProWo.zaehler.length;
                response.write('<div data-role="ui-content" id="content">');  
                for(i=0; i < len; i++) {
                    response.write('<div class="btn_zaehler_1" menu="' + jsonProWo.zaehler[i].id + '">');
                    response.write('<table style="width:100%">');
                    response.write('<tbody><tr><td class="zaehler_table_col11">' + jsonProWo.zaehler[i].name + '</td>');
                    response.write('<td  class="zaehler_table_col2">' + jsonProWo.zaehler[i].stand + ' ' + jsonProWo.zaehler[i].einheit + '</td>');
                    response.write('<td rowspan="2" class="zaehler_table_col3" menu="' + jsonProWo.zaehler[i].id + '" datum="' + jsonProWo.zaehler[i].datum + '" offset="' + jsonProWo.zaehler[i].offset + '" anzeigeart="' + jsonProWo.zaehler[i].anzeigeart +'">');
                    response.write('<img src="../images/einstellungen.png"/></td></tr>');
                    datum = jsonProWo.zaehler[i].datum;
                    iPos = datum.indexOf('-');
                    jahr = datum.slice(0, iPos);
                    datum = datum.slice(iPos+1);
                    iPos = datum.indexOf('-');
                    monat = datum.slice(0, iPos);
                    tag = datum.slice(iPos+1);
                    response.write('<tr><td class="zaehler_table_col12">' + tag + '/' + monat + '/' + jahr + '</td>');
                    response.write('<td class="zaehler_table_col2">' + jsonProWo.zaehler[i].anzeige + ' ' + jsonProWo.zaehler[i].einheit + '</td></tr></tbody></table></div>');
                }
                response.end('</div>');
                break;
            case 2:
                response.write(ret);
                response.end('');
                break;
            case 3:
                response.write(ret);            
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