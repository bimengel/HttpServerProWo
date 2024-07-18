var net = require('net');
var fs = require('fs');

exports.readFile = function(fileName) {
    return new Promise(function(resolve, reject) {
        fs.readFile(fileName, function(err, imagebuffer) {
            if(err) 
                reject(err);
            else 
                resolve(imagebuffer);
        });
    });
}

exports.queryProWo = function(param) {
    return new Promise (function(resolve, reject) {
        var ret = '';
        var client = net.Socket();
        client.connect(3001, '192.168.1.215', function() {
            client.write(param);
        });
        client.on('data', function(data) {
            ret += data;
        });
        client.on('close', function() {
            client.destroy();
            resolve(ret);
        });
        client.on('error', function(error) {
            reject(error);
        });
    });
}

exports.addLeadingZeros = function(n, length) {
    let str = (n > 0 ? n : -n) + "";
    let zeros = "";
    let i;
    for (i = length - str.length; i > 0; i--)
        zeros += "0";
    zeros += str;
    return n >= 0 ? zeros : "-" + zeros;
}

exports.lese = async function(request, response, str) {
    try {
        let json, i, j, len;
        let jsonProWo;
        let bFirst = true;
        let strRicht, strNSart;

        if(str != "0_0_0_0")
            bFirst = false;
        if(bFirst)
        {
            response.writeHead(200, {'Content-Type': 'text/html'});
            const retHeader = this.readFile("./html/header.html");
            await retHeader.then(function(ret) {
                response.write(ret)
            });
        }
        const retProWo = this.queryProWo(str + ';1;'); 
        await retProWo.then(function(ret) { 
            json = ret;
        });

        jsonProWo = JSON.parse(json);
        len = jsonProWo.navbar.length;
        if(len > 4)
            len = 4;
        response.write('<div id="contentnav">');
        response.write('<div data-role=header data-tap-toggle="false" role="banner" class="ui-header ui-bar-inherit">');
        response.write('<h1 class="home ui-title" role="heading" aria-level="1" menu="0_0_' + jsonProWo.pos);
        response.write('_' + jsonProWo.anzahl + '">' + jsonProWo.title + '</h1>');
        // Navigationsleiste ausgeben
        response.write('<div class="ui-grid-' + String.fromCharCode(99) + ' center">');
        for(i = 0; i < len; i++) {
            j = i + 97; // a b ....
            response.write('<div class="ui-block-' + String.fromCharCode(j) + '"><button type=button class="nav ');
            switch(jsonProWo.navbar[i].id[0]) {
                case '1': // Steuerung
                    response.write('nav_steuerung');
                    break;
                case '2': // Heizung
                    response.write('nav_heizung');
                    break;
                case '3': // Zähler
                    response.write('nav_zaehler');
                    break;
                case '4': // Alarm
                    response.write('nav_alarm');
                    break;
                case '5': // Wetterstation
                    response.write('nav_wetterstation');
                    break;
                case '6': // Sensoren
                    response.write('nav_sensor');
                    break;
                case '7': // Alarm clock
                    response.write('nav_alarmclock');
                    break;
                default:
                    break;
            }
            response.write(' ui-btn ui-shadow ui-corner-all"');
            response.write(' id=' + jsonProWo.navbar[i].id  + '><img src="images/' + jsonProWo.navbar[i].image 
                            + '" title="' + jsonProWo.navbar[i].text + '"/></button></div>\n'); 
        }
        response.write('</div></div>');
        response.write('<div data-role="ui-content" id="content">');
        response.write('<div class="prowo_home_uhr"><table class="prowo_home_uhr_table"><tr><td>' + jsonProWo.sa + '<img class="a"src="images/sonnenaufgang30.png"></td>');
        response.write('<td>' + jsonProWo.uhr + '</td><td><img class="a" src="images/sonnenuntergang30.png">' + jsonProWo.su + '</td></tr></table></div>');
        if(jsonProWo.anzWriteMessage)
        {
            response.write('<div><table class="prowo_home_message_table">');
            for(i=0; i < jsonProWo.anzWriteMessage; i++){
                response.write('<tr><th class="prowo_home_message_column1">' + jsonProWo.WriteMessage[i].Text + '</th>');
                response.write('<th class="prowo_home_message_delete" menu="0_1_0_' + jsonProWo.WriteMessage[i].nr + '"><img src="../images/signMinus.png"></th></tr>');
            }
            response.write('</table></div>');
        }

        if(jsonProWo.heizung == 1)
        {
            response.write('<div class="prowo_home_heizung">' + jsonProWo.heizungtext + '</div>');
        }
        if(jsonProWo.alarm == 1)
        {
            response.write('<div class="prowo_home_alarm">' + jsonProWo.alarmtext + '</div>');
        }
        if(jsonProWo.gsm == 1)
        {
            response.write('<div class="prowo_home_gsm">GSM Signal:' + jsonProWo.signal + ' Provider:' + jsonProWo.provider);
            if(jsonProWo.gsmerror == 'no error')
                response.write('</div>');
            else
                response.write('<br>' + jsonProWo.gsmerror + '</div>');
        }
        if(jsonProWo.history == 1)
        {

            response.write('<div class="prowo_home_history">Lichtprogramm ');
            if(jsonProWo.tage != 0)
                response.write(' von vor ' + jsonProWo.tage + ' Tagen');
            else
                response.write('nicht aktiviert');
            if(jsonProWo.historyerror != "")
                response.write('<br>' + jsonProWo.historyerror + '</div>');
            else
                response.write('</div>');
        }
        // Wetterstation
        if(jsonProWo.ws == 1)
        {
            i = Math.trunc(jsonProWo.windricht / 225);
            switch(i) {
                case 0:
                    strRicht = "N";
                    break;
                case 1:
                    strRicht = "NNO";
                    break;
                case 2:
                    strRicht = "NO";
                    break;
                case 3:
                    strRicht = "ONO";
                    break;
                case 4:
                    strRicht = "O";
                    break;
                case 5:
                    strRicht = "OSO";
                    break;
                case 6:
                    strRicht = "SO";
                    break;
                case 7:
                    strRicht = "SSO";
                    break;
                case 8:
                    strRicht = "S";
                    break;
                case 9:
                    strRicht = "SSW";
                    break;
                case 10:
                    strRicht = "SW";
                    break;
                case 11:
                    strRicht = "WSW";
                    break;
                case 12:
                    strRicht = "W";
                    break;
                case 13:
                    strRicht = "WNW";
                    break;
                case 14:
                    strRicht = "NW";
                    break;
                case 15:
                    strRicht = "NNW";
                    break;
                default:
                    strRicht = "???";
                    break;
            }
            switch(jsonProWo.nsart) {
                case 0:
                    strNSart = "heiter20";
                    break;
                case 60:
                case 69:
                    strNSart = "regen20";
                    break;
                case 67:
                case 70:
                    strNSart = "schnee20";
                    break;
                case 90:
                    strNSart = "hagel20";
                    break;
                default:
                    strNSart = "nan";
                    break; 
            }
            response.write('<div class="prowo_home_ws"><table class="prowo_home_table table_border">');
            response.write('<tr><td rowspan="4"><img src="images/temp.png"></td>');
            response.write('<td>' + jsonProWo.tempmax/10 + '°C</td><td rowspan="2"><img src="images/humidity.png"></td><td>'+ jsonProWo.feuchte/10 + '%</td></tr>');
            response.write('<tr><td rowspan="2">' + jsonProWo.tempakt/10 + '°C</td><td>' + jsonProWo.helligkeit + 'lx</td></tr>');
            response.write('<tr><td rowspan="2"><img src="images/barometer.png"></td><td rowspan="2">' + jsonProWo.luftdruck/10 + 'hPa</td></tr>');
            response.write('<tr><td>' + jsonProWo.tempmin/10 + '°C</td></tr>');
            response.write('<tr class="border_top"><td rowspan="3"><img src="images/wind.png"></td>');
            response.write("<td>" + jsonProWo.windgeschw/10 + "km/h</td><td>10'</td><td>" + jsonProWo.windgeschwmax10/10 + 'km/h</td></tr>');
            response.write('<tr><td>' + strRicht + "</td><td>30'</td><td>" + jsonProWo.windgeschwmax30/10 + 'km/h</td></tr>');
            response.write('<tr><td>' + jsonProWo.windgeschwmax/10 + "km/h</td><td>60'</td><td>" + jsonProWo.windgeschwmax60/10 + 'km/h</td></tr>');
            response.write('<tr class="border_top"><td rowspan="3"><img src="images/niederschlagsmenge.png"></td><td><img src="images/tag.png"></td>');
            response.write('<td><img src="images/woche.png"></td><td><img src="images/monat.png"></td></tr>');
            response.write('<tr><td>' + jsonProWo.nsmengetag[0]/100 + '</td><td>' + jsonProWo.nsmengewoche[0]/100 + '</td><td>' + jsonProWo.nsmengemonat[0]/100 + '</td></tr>');
            response.write('<tr><td>' + jsonProWo.nsmengetag[1]/100 + '</td><td>' + jsonProWo.nsmengewoche[1]/100 + '</td><td>' + jsonProWo.nsmengemonat[1]/100 + '</td></tr>');
            response.write('<tr><td><img src="images/' + strNSart + '.png"></td><td>' + jsonProWo.nsmengetag[2]/100 + '</td><td>' + jsonProWo.nsmengewoche[2]/100 + '</td><td>' + jsonProWo.nsmengemonat[2]/100 + '</td></tr>');
            response.write('</table></div>');
        }
        response.write('</div></div>');       
        if(bFirst)
        {

            const retFooter = this.readFile("./html/footer.html");
            await retFooter;
            retFooter.then(function(ret) {
                response.write(ret);
                response.end("");
            });
        }
        else
            response.end("");
    }
    catch (err){
        console.error(err.message);
        response.end(err.message);
    }
}