'use strict'

var express = require('express');
var router = express.Router();
var net = require('net');
var prowo = require('../modules/prowo.js');

router.use(function(request, response, next) {
    
    try {
        let jsonProWo;
        let len, i, id, length, j;
        let jahr, monat, tag, stunde, minute;
        let wochentag;
        let str;

        str = request.body.id + ";" + request.body.type + ";";
        switch(request.body.type) {
            case 2: // Verwaltheizung Heizprogramm Wochentag geändert
                str = request.body.id + ";2;" + request.body.tag +";"; 
                break;
            case 3: // Heizprogrammtag löschen
                break;
            case 4: // Heizprogrammtag kopieren
                str += request.body.idVon +";";
                break;
            case 5: // neue Beschreibung
                str += request.body.Beschreibung + ";";
                break;
            case 6: // Datum und Uhrzeit für ein Heizprogramm
                str += request.body.datum + ";" + request.body.uhrzeit + ";";
                break;
            case 7: // Uhrzeit und Temperatur eines Heizkörpers lesen
                break;
            case 8: // Uhrzeit und Temperatur eines Heizkörpers schreiben
                jsonProWo = JSON.parse(request.body.json);
                length = jsonProWo.pkt.length;
                for(i=0; i < length; i++) {
                    str += jsonProWo.pkt[i].time + ";";
                    str += jsonProWo.pkt[i].temp + ";";
                }
                break;
            default:
                break;
        }
        prowo.queryProWo(str)
        .then( function(ret) {
            jsonProWo = JSON.parse(ret);
            switch(jsonProWo.type) {
            case 1:
                len= jsonProWo.list.length;
                response.write('<div data-role="ui-content" id="content">');  
                response.write('<div class="btn_heizung_1" menu="2_0_0_1">');
                response.write('<h4>' + jsonProWo.HeizProgramm) + '</h4>';                            
                response.write('<h4>' +jsonProWo.HeizProgrammTag + '</h4></div>');  
                for(i=0; i < len; i++) {
                    response.write('<div class="btn_heizung_2" menu="' + jsonProWo.list[i].id + '"');
                    response.write(' type="button" prowotype="' + jsonProWo.list[i].type + '">');
                    if(jsonProWo.list[i].image === undefined)
                        response.write('<div class="prowo_btn_img"></div>');
                    else
                        response.write('<div class="prowo_btn_img"><img src="' + jsonProWo.list[i].image + '" /></div>');
                    response.write('<div class="prowo_btn_text">' + jsonProWo.list[i].text + '</div>');
                    if(jsonProWo.list[i].status !== "not") {
                        response.write('<div class="prowo_btn_schalten">')
                        if(jsonProWo.list[i].status === true)
                            response.write('<img src="../images/prowo_btn_ein.png"/>');
                        else
                            response.write('<img src="../images/prowo_btn_aus.png"/>');
                        response.write('<img class="prowo_btn_rahmen"  src="../images/prowo_btn_rahmen.png"/></div>');
                    } 
                    if(jsonProWo.list[i].type === 1)
                        response.write('<div class="prowo_btn_text2"> Ist: ' + jsonProWo.list[i].ist + '°   Soll: ' + jsonProWo.list[i].soll + '° -</div>');
                    response.write('</div>');
                }
                response.end('</div>');
                break;
            case 2:
                response.write('<div data-role="ui-content" id="content">');  
                len = jsonProWo.Heizprogramme.length;
                for(i=0; i < len; i++)
                {   
                    response.write('<table class="heizung_3" menu="' + jsonProWo.Heizprogramme[i].id + '">');
                    response.write('<colgroup><col><col width="35px"><col width="35px"</colgroup>');
                    response.write('<tbody><tr><td class="btn_heizung_3" id="' + jsonProWo.Heizprogramme[i].id + '">');
                    if(jsonProWo.Heizprogramme[i].Datum) {
                        jahr = Math.trunc(jsonProWo.Heizprogramme[i].Datum / 10000);
                        monat = Math.trunc(Math.trunc((jsonProWo.Heizprogramme[i].Datum % 10000)) / 100);
                        tag = Math.trunc(Math.trunc(jsonProWo.Heizprogramme[i].Datum % 10000) % 100);
                        stunde = Math.trunc(jsonProWo.Heizprogramme[i].Uhrzeit / 60);
                        minute = Math.trunc(jsonProWo.Heizprogramme[i].Uhrzeit % 60);
                        response.write(jsonProWo.Heizprogramme[i].text + ' - ' + tag + '.' + monat + '.' + jahr + '  ' + stunde + 'h' + prowo.addLeadingZeros(minute, 2) + '</td>');
                    }
                    else
                        response.write(jsonProWo.Heizprogramme[i].text + '</td>');
                    if(i === 0)
                        response.write('<td></td>');
                    else {
                        response.write('<td><img class="btn_clock" menu="' + jsonProWo.Heizprogramme[i].id + '"  src="../images/clock.png"');
                        if(jsonProWo.Heizprogramme[i].Datum)
                            response.write(' datum="' + jsonProWo.Heizprogramme[i].Datum + '" uhrzeit="'+ jsonProWo.Heizprogramme[i].Uhrzeit + '"');
                        response.write('/></td>');
                    }
                    response.write('<td><img class="btn_signplus ' + jsonProWo.Heizprogramme[i].id + '"  src="../images/signPlus.png" ');
                    response.write('menu="' + jsonProWo.Heizprogramme[i].id + '"/></td></tbody></tr></table>');  
                    length = jsonProWo.Heizprogramme[i].HeizProgrammTag.length;
                    for(j=0; j < length; j++)
                    {
                        response.write('<table class="table_heizprogramm_wochentage"><colgroup><col width="35px"></colgroup><tbody><tr>');
                        response.write('<td><img class="btn_signminus ' + jsonProWo.Heizprogramme[i].HeizProgrammTag[j].id + '" ');
                        response.write('menu="' + jsonProWo.Heizprogramme[i].HeizProgrammTag[j].id + '" src="../images/signMinus.png"');
                        if(!jsonProWo.Heizprogramme[i].HeizProgrammTag[j].tage)
                            response.write(' style="visibility: visible";');
                        response.write('/></td>');
                        response.write('<td><div class="heizung_4" menu=\"' + jsonProWo.Heizprogramme[i].HeizProgrammTag[j].id + '\"><div ');
                        response.write('class="btn_heizung_4" id=\"' + jsonProWo.Heizprogramme[i].HeizProgrammTag[j].id + '\">');
                        response.write(jsonProWo.Heizprogramme[i].HeizProgrammTag[j].text + '</div>');
                        showWochentagTabelle(response, jsonProWo, i, j);
                        response.write('</div></td></tr></table>');
                    }
                }
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

function showWochentagTabelle(response, jsonProWo, iHeizProgramm, iWochenTag) {
    let k, menu, tag, i, chkclass;

    tag = jsonProWo.Heizprogramme[iHeizProgramm].HeizProgrammTag[iWochenTag].tage;
    chkclass = '2_' + (iHeizProgramm + 1) + '_';
    response.write('<table class="wochentag_tabelle">');
    response.write('<tr><td>Mo</td><td>Di</td><td>Mi</td><td>Do</td><td>Fr</td><td>Sa</td><td>So</td></tr><tr>');
    for(k=0, i=64; k < 7; k++, i=i/2) {
        menu = jsonProWo.Heizprogramme[iHeizProgramm].HeizProgrammTag[iWochenTag].id + '_' + String.fromCharCode(k+48);
        response.write('<td><input type="checkbox" class="chk_wochentabelle ' + chkclass + k + 
            ' ' + jsonProWo.Heizprogramme[iHeizProgramm].HeizProgrammTag[iWochenTag].id + '" + menu="' + menu + '"');
        if(tag & i)
            response.write(' checked/></td>');
        else
            response.write('/></td>');
    }
    response.write('</table>');
}

module.exports = router;