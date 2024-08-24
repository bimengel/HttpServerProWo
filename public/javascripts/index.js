'use strict'


$(document).ready(function() {
    let json;
    let jsonLen;
    let dataGlobal = {};


    $(window).on("resize", function () {
        let url = window.location.href;
        let pos = url.search("#");
        if(pos > 0)
        {
            url = url.slice(pos+1);
            switch(url) {
                case "sensorValues":
                    verwaltSensor();
                    break;
                case "uhrzeitTemperatur":
                    anzeigeCanvasHeizung();
                    break;
                case "diagrammZaehler":
                    subVerwaltZaehler();
                    break;
                default:
                    break;
            }
        }
    });
//
// Home
//
    $("body").on("click", ".home", function() { 
        let menu  = $(".home").attr('menu');
        let data = {};
        data.id = menu;
        $.ajax({
            method : "POST",
            url : "ajax_nav_home.js",
            dataType : "html",
            data : JSON.stringify(data),
            contentType: 'application/json',
        }).done(function(data, textStatus) {
            $("#contentnav").replaceWith(data);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });        
    });
//
// Navigation
//
    // 'Grafikmenü' - Steuerung ist angewählt worden 
    $("body").on("click", ".nav_steuerung", function() {
        let data = {};
        data.id = this.id;
        data.type = 1;
        $.ajax({
            method : "POST",
            url : "ajax_nav_steuerung.js",
            dataType: 'html',
            data : JSON.stringify(data),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            $("#content").replaceWith(data); 
            $(".prowo_btn_schalten").setStatus();
            $(".prowo_btn_img").setImage();            
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });
    });

    // 'Grafikmenü' - Heizung ist angewählt worden 
    $("body").on("click", ".nav_heizung", function() {
        let data = {};
        data.id = this.id;
        data.type = 1;
        $.ajax({
            method : "POST",
            url : "ajax_nav_heizung.js",
            dataType: 'html',
            data : JSON.stringify(data),
            contentType: 'application/json'
        }).done(function(data, textStatus) {   
            $("#content").replaceWith(data); 
            $(".prowo_btn_schalten").setStatus();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });
    });
    // 'Grafikmenü' - Zaehler ist angewählt worden 
    $("body").on("click", ".nav_zaehler", function() {
        let data = {};
        data.id = this.id;
        data.type = 1;
        $.ajax({
            method : "POST",
            url : "ajax_nav_zaehler.js",
            dataType: 'html',
            data : JSON.stringify(data),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            $("#content").replaceWith(data); 
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });
    });

    // 'Grafikmenü' - Alarm ist angewählt worden
    $("body").on("click", ".nav_alarm", function() {
        let data = {};
        data.id = this.id;
        data.type = 1;
        ListeAlarme(data);
    });

    // 'Grafikmenü' - Sensor ist angewählt worden 
    $("body").on("click", ".nav_sensor", function() {
        let data = {};
        data.id = this.id;
        data.type = 1;
        $.ajax({
            method : "POST",
            url : "ajax_nav_sensor.js",
            dataType: 'html',
            data : JSON.stringify(data),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            $("#content").replaceWith(data); 
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });
    });
    
    // 'Grafikmenü' - Alarm Clock ist angewählt worden 
    $("body").on("click", ".nav_alarmclock", function() {
   
        dataGlobal.id = this.id;
        dataGlobal.type = 1;
        AlarmClock();
    });

    // Message löschen
    $("body").on("click", ".prowo_home_message_delete", function(event) {
        let data = {};
        let str;
        event.stopImmediatePropagation();
        if($(this).attr('menu')) {     
            data.id = $(this).attr('menu');
            $.ajax({
                method : "POST",
                url : "ajax_nav_home.js",
                dataType: 'html',
                data : JSON.stringify(data),
                contentType: 'application/json'
            }).done(function(data, textStatus) {
                $("#contentnav").replaceWith(data);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                $("#ausgabe").html(errorThrown);
            });
        }
    });
//
//  AlarmClock - Wecker
//
    function AlarmClock() {
        $.ajax({
            method : "POST",
            url : "ajax_nav_alarmclock.js",
            dataType: 'html',
            data : JSON.stringify(dataGlobal),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            $("#content").replaceWith(data); 
            $(".prowo_btn_schalten").setStatus();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });
    }
    $("body").on("click", ".btn_alarmclock", function(event) {

        event.stopImmediatePropagation();
        dataGlobal.id = $(this).attr('menu');
        dataGlobal.type = 3;
        OpenDialogAlarmClock();
    });

    function OpenDialogAlarmClock() {
        let i, iPos, str, iRepeat;

        $.ajax({
            method : "POST",
            url : "ajax_nav_alarmclock.js",
            dataType: 'html',
            data : JSON.stringify(dataGlobal),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            json = JSON.parse(data);
            $("#tpalarmclock").val(json.uhr);
            $("#tpalarmclock").attr('menu', json.id);
            $("#inputalarmclockName").val(json.name);
            for(i=0, iPos=1, iRepeat = json.repeat; i < 7; i++)
            {
                str = "#chk_alarmclock" + (i+1);               
                if(iRepeat & iPos)
                    $(str).prop("checked", true);                 
                else 
                    $(str).prop("checked", false);   
                iPos = iPos << 1;              
            }
            $("#btn_snooze").attr('status', json.snooze);
            if(json.snooze == "true")
                $("#alarmclock_prowo_btn_aus").animate({ left : "15px" }, 300);
            else 
                $("#alarmclock_prowo_btn_aus").animate({ left : "0px" }, 300);            
            $("#btn_snooze").attr('menu', json.id);
            $("#btn_snooze").setStatus();
            $("#dialogalarmclock").popup("open");
            iPos = json.method.length;
            $('#dialogalarmclock_selectbox option').each(function() {
                $(this).remove();
            });   
            iPos = json.methodes.length;         
            for(i=0; i < iPos; i++)
                $('#dialogalarmclock_selectbox').append($('<option>', {
                    value: i+1,
                    text: json.methodes[i]
                }));
            $('#dialogalarmclock_selectbox').val(json.method).change();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });        
    }
    
    $("body").on("click", "#popupClearalarmclock", function(event) {
        dataGlobal.id = $("#tpalarmclock").attr("menu");
        dataGlobal.type = 5;
        dataGlobal.json = JSON.stringify(json);

        $.ajax({
            method : "POST",
            url : "ajax_nav_alarmclock.js",
            dataType: 'html',
            data : JSON.stringify(dataGlobal),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            $("#content").replaceWith(data); 
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });        
    });

    $("body").on("click", "#popupOkalarmclock", function(event) {
        let uhrzeit, posminute, stunde, minute, iUhrzeit;
        let i, iPos, str, iRepeat;

        uhrzeit = $("#tpalarmclock").val();
        posminute = uhrzeit.indexOf(":");
        stunde = uhrzeit.slice(0, posminute);
        minute = uhrzeit.slice(posminute+1);
        iUhrzeit = parseInt(stunde) * 60 + parseInt(minute);
        str = "{\"uhr\": \"\"}";
        json = JSON.parse(str);
        json.uhr = uhrzeit;
        json.time = iUhrzeit;
        json.name = $("#inputalarmclockName").val();
        for(i=0, iPos=1, iRepeat=0; i < 7; i++)
        {
            str = "#chk_alarmclock" + (i+1);  
            if($(str).prop("checked"))
                iRepeat += iPos;
            iPos = iPos << 1;                          
        }
        json.repeat = iRepeat;
        json.snooze = $("#btn_snooze").attr('status');
        json.method = $("#dialogalarmclock_selectbox").val();
        dataGlobal.id = $("#tpalarmclock").attr("menu");
        dataGlobal.type = 4;
        dataGlobal.json = JSON.stringify(json);        
        $.ajax({
            method : "POST",
            url : "ajax_nav_alarmclock.js",
            dataType: 'html',
            data : JSON.stringify(dataGlobal),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            $("#content").replaceWith(data); 
            $(".prowo_btn_schalten").setStatus();            
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });
    });

    // Ein- Ausschalter
    $("body").on("click", ".alarmclock_btn_schalten", function(event) {
        let data = {};
        let str;
        event.stopImmediatePropagation();
        if($(this).attr('menu')) {
            let str = ".prowo_btn_aus." + $(this).attr('menu');
            if($(this).attr('status') == 'true') {
                $(this).attr('status' , false);
                $(str).animate({ left : "0px" }, 300);
            }
            else {
                $(str).animate({ left : "15px" }, 300);
                $(this).attr('status' , true);
            }      

            data.id = $(this).attr('menu');
            data.type = 2;      // Schalter ein/aus an ProWo senden
            data.status = $(this).attr('status');
            $.ajax({
                method : "POST",
                url : "ajax_nav_alarmclock.js",
                dataType: 'html',
                data : JSON.stringify(data),
                contentType: 'application/json'
            }).done(function(data, textStatus) {
                $("#ausgabe").html(data);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                $("#ausgabe").html(errorThrown);
            });
        }
    });

    $("body").on("click", "#btn_snooze", function(event) {

        if($(this).attr('status') == 'true') {
            $(this).attr('status' , false);
            $("#alarmclock_prowo_btn_aus").animate({ left : "0px" }, 300);
        }
        else {
            $("#alarmclock_prowo_btn_aus").animate({ left : "15px" }, 300);
            $(this).attr('status' , true);
        }         
    });
    
    $("body").on("click", ".alarmclock_signplus", function(event) {
        let i, str;

        event.stopImmediatePropagation();
        dataGlobal.id = "7_2_0_0";
        dataGlobal.type = 3;
        OpenDialogAlarmClock();
    });

    $("body").on("click", "#alarmaktiv_button_snooze", function(event) {
        let i, str;

        event.stopImmediatePropagation();
        dataGlobal.id = "7_7_1_0";
        dataGlobal.type = 7;
        AlarmClock();
    });  
    
    $("body").on("click", "#alarmaktiv_button_stopp", function(event) {
        let i, str;

        event.stopImmediatePropagation();
        dataGlobal.type = 7;
        dataGlobal.id = "7_7_0_0";
        AlarmClock();
    }); 
//    
// Sensor
//
    $("body").on("click", ".btn_sensor", function(event) {
        let data = {};
        data.id = $(this).attr('menu');
        data.type = 2;
        $.ajax({
            method : "POST",
            url : "ajax_nav_sensor.js",
            dataType: 'html',
            data : JSON.stringify(data),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            json = JSON.parse(data);
            $.mobile.navigate("#sensorValues");  
            verwaltSensor();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });
    });
    $("body").on("click", ".canvasSensor", function(event){
        $.mobile.navigate("#startSeite");
        $(".nav_sensor").trigger("click", "redraw");
    });

    function verwaltSensor()
    {
        let i, j, uhrmin, mindiff, stunde, k;
        let str;
        let canvasHeight = $(window).height();
        let canvasWidth = $(window).width();
        let cv = document.getElementById("canvasSensor");
        cv.height = canvasHeight;
        cv.width = canvasWidth;  
        cv.title = json.name;
        canvasHeight -= 20;
        let ctx = cv.getContext("2d");  
        let yf = (canvasHeight-15) / 500;
        let xf = 1440 / (canvasWidth-25);
        if(xf < 1)
        {
            xf = 1;
            canvasWidth = 1440;
        }
        ctx.font = "15px ";
        ctx.fillStyle = "green";
        for(i=1; i < 11; i++)
            ctx.fillText(i*50, 0, canvasHeight - i*50*yf+15, 19);        
        ctx.fillStyle = "red";
        for(i=1; i < 11; i++)
            ctx.fillText((i*5).toString() + "°C", 0, canvasHeight - i*50*yf+5, 19);        
        ctx.fillStyle = "blue";
        for(i=1; i < 11; i++)
            ctx.fillText((i*10).toString() + "%", 0, canvasHeight - i*50*yf-5, 19);
        // Y-Achse Einheiten
        for(i=1; i < 101;i++)
        {   
            ctx.beginPath();
            if(i % 10 == 0)
            {   j = canvasWidth;
                ctx.strokeStyle = "#C0C0C0";
            }
            else if(i % 5 == 0)
            {   j = canvasWidth;
                ctx.strokeStyle = "#E8E8E8";
            }
            else
            {   j = 3;
                ctx.strokeStyle= "black";
            }
            ctx.moveTo(20, canvasHeight - i*5*yf);
            ctx.lineTo(20+j, canvasHeight - i*5*yf);
            ctx.stroke();
        }
        ctx.moveTo(20, 0);
        ctx.lineTo(20, canvasHeight);
        ctx.lineTo(canvasWidth, canvasHeight);
        uhrmin = json.uhrmin;
        mindiff = uhrmin % 60;
        stunde = parseInt(uhrmin / 60);
        for(i=24; i > 0; i--)
        {
            if(i%2 == 0)
                k = 0;
            else 
                k = canvasHeight-5;
            j = (i*60-mindiff)/xf + 20;
            ctx.moveTo(j, canvasHeight+5);
            ctx.lineTo(j, k);
        }
        // X-Achse Uhrzeit anzeigen
        ctx.fillStyle = "black";
        for(i=24; i>1;i -=2)
        {
            j = (i*60-mindiff)/xf +15;
            ctx.fillText(stunde, j, canvasHeight+15);
            stunde -= 2;
            if(stunde < 0)
                stunde += 24;
        }
        ctx.stroke();
        // Luftqualität
        ctx.strokeStyle = "green";   
        ctx.lineWidth = 1;       
        let wertmin=500, wertmax=0, wert;
        ctx.beginPath();
        for(i=0, j=0; i < 1440; i++)
        {   wert = parseInt(json.messwerte[i].voc);
            if(wert > wertmax)
                wertmax = wert;
            if(wertmin > wert) 
                wertmin = wert;
            if(i > (j+1) * xf)
            {   j++;
                if(wertmin === wertmax)
                    wertmax++;
                ctx.moveTo(j+20, canvasHeight - wertmax*yf);
                ctx.lineTo(j+20, canvasHeight - wertmin*yf);
                wertmin = wert;
                wertmax = wert;
            }
        }
        // Temperatur
        ctx.stroke();            
        ctx.strokeStyle = "red"; 
        ctx.beginPath();
        wertmin=50, wertmax=0, wert;
        for(i=0, j=0; i < 1440; i++)
        {   wert = parseInt(json.messwerte[i].temp);
            if(wert > wertmax)
                wertmax = wert;
            if(wertmin > wert)
                wertmin = wert;
            if(i > (j+1) * xf)
            {   j++;
                if(wertmin === wertmax)
                    wertmax++;                
                ctx.moveTo(j+20, canvasHeight - wertmax*yf);
                ctx.lineTo(j+20, canvasHeight - wertmin*yf);
                wertmin = wert;
                wertmax = wert;
            }
        } 
        // Feuchtigkeit
        ctx.stroke();
        ctx.beginPath();            
        ctx.strokeStyle = "blue"; 
        wertmin=100, wertmax=0, wert;
        for(i=0, j=0; i < 1440; i++)
        {   wert = parseInt(json.messwerte[i].humi/2);
            if(wert > wertmax)
                wertmax = wert;
            if(wertmin > wert)
                wertmin = wert;
            if(i > (j+1) * xf)
            {   j++;
                if(wertmin === wertmax)
                    wertmax++;
                ctx.moveTo(j+20, canvasHeight - wertmax*yf);
                ctx.lineTo(j+20, canvasHeight - wertmin*yf);
                wertmin = wert;
                wertmax = wert;
            }
        }
        ctx.stroke();
    }
// 
// Alarm
//
    function ListeAlarme(data) {
        
        $.ajax({
            method : "POST",
            url : "ajax_nav_alarm.js",
            dataType: 'html',
            data : JSON.stringify(data),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            $("#content").replaceWith(data); 
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });
    }

    // ALARM
    $("body").on("click", ".btn_alarm_1", function(event) {
        let data = {};
        data.id = $(this).attr('menu');
        data.type = 2;
        ListeAlarme(data);
    });
    // Alarm - Ein- Ausschalter
    $("body").on("click", ".btn_alarm_2", function(event) {
        
        let str;
        event.stopImmediatePropagation();
        event.preventDefault();
        str = $(this).parent().text();
        $("#AlarmPassword").val("");  
        $("#TitelTastaturAlarm").html(str);
        str = $(this).parent().attr('menu');
        if($(this).attr('status') == "0")
            $('#submitAlarmPassword').text('Starten');
        else
            $('#submitAlarmPassword').text('Stoppen');
        $("#AlarmPassword").attr('menu', str);
        $("#dialogAlarmTastatur").popup("open");
        $("#AlarmPassword").focus();
    });
    // Alarm eine Kondition bei dieser Einschaltung nicht berücksichtigen
    $("body").on("click", ".btn_alarm_3", function(event) {
        let data = {};
        data.id = $(this).attr('menu');
        data.type = 5;
        ListeAlarme(data);
    });
    $("body").on("click", "#zurueckAlarm", function(event) {
        let data = {};
        data.id = "4_0_0_0";
        data.type = 6;
        ListeAlarme(data);
    });
    $("body").on("click", "#actualizeAlarm", function(event) {
        let data = {};
        data.id = $(this).attr('menu');
        data.type = 7;
        ListeAlarme(data);
    });
    
    $("#AlarmPassword").on("keypress", function(e){
        if(e.which === 13)
            $("#submitAlarmPassword").trigger("click");
    });
    $("body").on("click", "#submitAlarmPassword", function(){

        dataGlobal.password = $("#AlarmPassword").val();
        dataGlobal.id = $("#AlarmPassword").attr('menu');
        dataGlobal.type = 3;
        $.ajax({
            method : "POST",
            url : "ajax_nav_alarm.js",
            dataType: 'html',
            data : JSON.stringify(dataGlobal),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            $("#content").replaceWith(data);   
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });
    
    });  
    $('body').on('click', '#popupCancelPassword', function() {
        $.mobile.navigate("#startSeite"); 
    });
    // History
    $('body').on('click', '.btn_alarm_history', function(event) {
        
        let i;
        event.stopImmediatePropagation();
        event.preventDefault();
        i = $('.btn_alarm_history').attr('menu');
        if(i > 0)
        {   $('#historyAnzTage').val(0);
            $("#dialogHistory_Aus").popup("open");
        }
        else
        {    $('#historyAnzTage').val(i);
            $("#dialogHistory_Ein").popup("open");
        }            
    });
    $('body').on('click', '#submitHistoryTage', function() {
        dataGlobal.id = "4_0_0_" + $('#historyAnzTage').val();
        dataGlobal.type = 4;
        $.ajax({
            method : "POST",
            url : "ajax_nav_alarm.js",
            dataType: 'html',
            data : JSON.stringify(dataGlobal),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            $("#content").replaceWith(data);   
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });        
    });
    $("#historyAnzTage").on("keypress", function(e){
        if(e.which === 13)
            $("#submitHistoryTage").trigger("click");
    });
    $('body').on('click', '#historyTageMinus', function(event) {
        let i;
        event.stopImmediatePropagation();
        event.preventDefault();        
        i = $('#historyAnzTage').val();
        i--;
        if(i >= 0)
            $('#historyAnzTage').val(i);
    });
    $('body').on('click', '#historyTagePlus', function(event) {
        let i;
        event.stopImmediatePropagation();
        event.preventDefault();        
        i = $('#historyAnzTage').val();
        i++;
        if(i >= 0)
            $('#historyAnzTage').val(i);
    });
//
// Wetterstation
//
    $('body').on('click', '.prowo_home_ws', function() {
        dataGlobal.id = "5_1_1_1";
        $.mobile.navigate("#diagrammZaehler");
        $('#anzeige_zaehler').attr('menu', '1');         
        $('#zaehler').attr('menu', '5');
        verwaltZaehler(3);        
    });
// ZAEHLER
// Diagramme
    $("body").on("click", ".btn_zaehler_1", function() {
       
       dataGlobal.id = $(this).attr('menu');
       $.mobile.navigate("#diagrammZaehler"); 
       $('#anzeige_zaehler').attr('menu', '1');
       $('#zaehler').attr('menu', '3');
       verwaltZaehler(3);      
    });
    // Offset setzen
    $("body").on("click", ".zaehler_table_col3", function(event){
        
        event.stopImmediatePropagation();
        dataGlobal.id = $(this).attr('menu');
        $("#zaehlerOffsetDatum").val($(this).attr('datum'));
        $("#zaehlerOffset").val($(this).attr('offset'));
        $("#dialogEinstellungZaehler").attr('anzeigeart', $(this).attr('anzeigeart'));
        $("#dialogEinstellungZaehler").popup("open");        
     });
    $("body").on("change", "#selectZaehlerName", function(event) {
        verwaltZaehlerWahl('1');
    });
    $("body").on("change", "#selectZaehlerJahr", function(event) {
        verwaltZaehlerWahl('2');
    });    
    $("body").on("change", "#selectZaehlerMonat", function(event) {
        verwaltZaehlerWahl('3');
    });
    $("body").on("click", "#naechsteZaehler", function() {
        verwaltZaehlerPfeile(1);
    });
    $("body").on("click", "#vorigeZaehler", function() {
        verwaltZaehlerPfeile(0);        
    });
    
    function verwaltZaehlerPfeile(richtung) {
        
        let strSelect = $('#anzeige_zaehler').attr('menu');
        let iZaehler = $('#selectZaehlerName').find('option:selected').val();
        let iLenZaehler = $('#selectZaehlerName option').length;
        let iJahr = $('#selectZaehlerJahr').find('option:selected').val();
        let iLenJahr = $('#selectZaehlerJahr option').length;
        let iMonat = $('#selectZaehlerMonat').find('option:selected').val();
        let iLenMonat = $('#selectZaehlerMonat option').length;
        switch(strSelect) {
            case '1':
                $('#selectZaehlerJahr').val(1);
                $('#selectZaehlerMonat').val(1);
                if(richtung) {
                    iZaehler++;
                    if(iZaehler > iLenZaehler)
                        iZaehler = 1;
                }
                else {
                    iZaehler --;
                    if(iZaehler === 0)
                        iZaehler = iLenZaehler;
                }
                $('#selectZaehlerName').val(iZaehler).change();
                break;
            case '2':
                if(richtung) {
                    iJahr++;
                    if(iJahr > iLenJahr) {
                        if(iMonat > 1)
                            iJahr = 2;
                        else
                            iJahr = 1;
                    }
                }                
                else {
                    iJahr--;
                    if(iMonat > 1) {
                        if(iJahr === 1)
                            iJahr = iLenJahr;
                    }
                    else {
                        if(iJahr === 0)
                            iJahr = iLenJahr;
                    }
                }
                $('#selectZaehlerJahr').val(iJahr).change();
                break;
            case '3':
                if(richtung) {
                    iMonat++;
                    if(iMonat > iLenMonat)
                        iMonat = 1;
                }
                else {
                    iMonat--;
                    if(iMonat === 0)
                        iMonat = iLenMonat;
                }
                $('#selectZaehlerMonat').val(iMonat).change();
                break;
            default:
                break;
        }
    }
    function verwaltZaehlerWahl(menu) {
        $('#anzeige_zaehler').attr('menu', menu);
        let iZaehler = parseInt($('#selectZaehlerName').find('option:selected').val());
        let iJahr = parseInt($('#selectZaehlerJahr').find('option:selected').val());
        let iMonat = parseInt($('#selectZaehlerMonat').find('option:selected').val());
        if(iJahr === 1)
            iMonat = 1;
        dataGlobal.id = $('#zaehler').attr('menu') + '_' + iZaehler + '_' + iJahr + '_' + iMonat;
        verwaltZaehler(4);
    }

    function verwaltZaehler(type){

        dataGlobal.type = type;
        $.ajax({
            method : "POST",
            url : "ajax_nav_zaehler.js",
            dataType: 'html',
            data : JSON.stringify(dataGlobal),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            json = JSON.parse(data);
            subVerwaltZaehler();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });   
    } 

    function subVerwaltZaehler() {
        let i, j, k, res, iAktZaehler, iAktJahr, iAktMonat, iLen, id, iPos1, iPos2, iPos3, str, iType;
        let strAktZaehler, strAktJahr, strAktMonat;
        let tmpTop, tmpHeight, tmpMin;

        $("#selectZaehlerName").empty();
        $("#selectZaehlerJahr").empty();
        $("#selectZaehlerMonat").empty();
        id = json.id;
        iPos1 = id.indexOf('_');
        iPos2 = id.indexOf('_', iPos1+1);
        iPos3 = id.indexOf('_', iPos2+1);
        iAktZaehler = parseInt(id.substring(iPos1+1, iPos2));
        iLen = json.zaehler.length;
        for(i=0; i < iLen; i++){
            if(i+1 === iAktZaehler) {
                str = '<option value="' + (i+1) + '" selected="selected">' + json.zaehler[i] + '</option>';
                strAktZaehler = json.zaehler[i];
            }
            else
                str = '<option value="' + (i+1) + '">' + json.zaehler[i] + '</option>';
            $('#selectZaehlerName').append(str);
        }
        $('#selectZaehlerName').selectmenu('refresh');
        iAktJahr = parseInt(id.substring(iPos2+1, iPos3));
        iLen = json.jahr.length;
        for(i=0; i < iLen; i++) {
            if(i+1 === iAktJahr) {
                str = '<option value="' + (i+1) + '" selected="selected">' + json.jahr[i] + '</option>';
                strAktJahr = json.jahr[i];
            }
            else
                str = '<option value="' + (i+1) + '">' + json.jahr[i] + '</option>';
            $('#selectZaehlerJahr').append(str);
        }   
        $('#selectZaehlerJahr').selectmenu('refresh');
        iAktMonat = parseInt(id.substring(iPos3+1));
        iLen = json.monat.length;
        for(i=0; i < iLen; i++) {
            if(i+1 === iAktMonat) {
                str = '<option value="' + (i+1) + '" selected="selected">' + json.monat[i] + '</option>';
                strAktMonat = json.monat[i];
            }
            else
                str = '<option value="' + (i+1) + '">' + json.monat[i] + '</option>';
            $('#selectZaehlerMonat').append(str);
        }   
        $('#selectZaehlerMonat').selectmenu('refresh');  
        $('#selectZaehlerName-button').css('display', 'flex');
        $('#selectZaehlerJahr-button').css('display', 'flex');
        $('#selectZaehlerMonat-button').css('display', 'flex'); 
        iType = parseInt($('#anzeige_zaehler').attr('menu'));  
        switch(iType) {
            case 1:
                str = strAktZaehler;
                break;
            case 2:
                str = strAktJahr;
                break;
            case 3:
                str = strAktMonat;
                break;
            default:
                str = "";
                break;
        }             
        $('#anzeige_zaehler').text(str);  
        let canvasHeight = $(window).height() -260;
        let canvasWidth = $(window).width() - 20;
        let cv = $("#canvasZaehler");
        cv.attr('height', canvasHeight);
        cv.attr('width', canvasWidth);  
        let max = Math.max.apply(Math, json.arr);         
        let min = Math.min.apply(Math, json.arr);
        let graphMax;
        if(min < 0) {
            graphMax = max - min;
        }
        else {
            graphMax = max;
            min = 0;
        }
        res = 50;
        i = 0;
        while(true) {
            if(res > graphMax)
                break;
            i++;
            if(i == 3) {
                res *= 2.5;
                i = 0;
            }
            else
                res *= 2;
        }
        graphMax = res;
        res /= 20;
        let graphFaktor = (canvasHeight - (2*20)) / graphMax;
        iLen = json.arr.length;
        let graphPadding;
        if(iLen > 12)
            graphPadding = 5;
        else
            graphPadding = 10; 
        let graphDisplayY = 30;
        let graphWidth = (canvasWidth - graphPadding - graphDisplayY) / iLen;
        if(iAktMonat > 1)
            iType = 3;
        else {
            if(iAktJahr == 1)
                iType = 1;
            else
                iType = 2;
        }
        //Draw Grid
        //let graphGridX = 20;
        let ctx = $("#canvasZaehler")[0].getContext("2d");
        ctx.fillStyle = "blue";
        let graphGridSize = graphFaktor * res;
        let nullLinie = canvasHeight + graphFaktor*min - 3 * graphPadding;
        k = parseInt(-min) / res;
        for(i = 0; i <= k+1; i ++){
            j = nullLinie + graphGridSize * i;
            ctx.moveTo(canvasWidth, j);
            ctx.lineTo(0, j);
            str = - i * res;
            ctx.fillText(str, 2, j-2, graphDisplayY - graphPadding);
        }
        k = parseInt(max) / res;
        for(i = 0; i <= k+1; i ++){
            j = nullLinie - graphGridSize * i;
            ctx.moveTo(canvasWidth, j);
            ctx.lineTo(0, j);
            str = i * res;
            ctx.fillText(str, 2, j-2, graphDisplayY - graphPadding);
        }           
        ctx.strokeStyle = "#dbdbdb";
        ctx.stroke();            
        for(i=0; i < iLen; i++) {
            tmpTop = canvasHeight - (graphFaktor * (json.arr[i] - min)).toFixed() - 3*graphPadding;
            tmpHeight = (json.arr[i] * graphFaktor).toFixed();
            ctx.fillRect(i*graphWidth + graphPadding + graphDisplayY, tmpTop, graphWidth-graphPadding, tmpHeight);
            switch(iType) {
                case 1:
                    str = json.jahr[i+1];
                    break;
                case 2:
                    str = json.monat[i+1].slice(0,3);
                    break;
                case 3:
                    if((i+1) % 2)
                        str = i+1;
                    else
                        str = "";
                    break;
                default:
                    break;
            }
            ctx.fillText(str, graphWidth+((i-1)*graphWidth)+graphPadding+2+graphDisplayY, canvasHeight-2, graphWidth);
        }
    }
 
    $("body").on("click", "#submitEinstellungZaehler", function(){
        let datum, posjahr, jahr, posmonat, monat, tag, iDatum, iOffset;

        iDatum = $("#zaehlerOffsetDatum").val();
        iOffset = $("#zaehlerOffset").val();
        dataGlobal.offset = iOffset;
        dataGlobal.datum = iDatum;
        dataGlobal.type = 2;
        $.ajax({
            method : "POST",
            url : "ajax_nav_zaehler.js",
            dataType: 'html',
            data : JSON.stringify(dataGlobal),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            $("#content").replaceWith(data);   
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });
    });
//
// STEUERUNG
//
    // Untermenü wird angewählt (zB Wohnzimmer, Aussen, .....)
    $("body").on("click", ".btn_steuerung_2", function(event) {
        let data = {};
        data.id = $(this).attr('menu');
        data.type = 1;
        $.ajax({
                method : "POST",
                url : "ajax_nav_steuerung.js",
                dataType: 'html',
                data : JSON.stringify(data),
                contentType: 'application/json'
            }).done(function(data, textStatus) {
                $("#content").replaceWith(data);   
                $(".prowo_btn_schalten").setStatus();
                $(".prowo_btn_img").setImage();                   
            }).fail(function(jqXHR, textStatus, errorThrown) {
                $("#ausgabe").html(errorThrown);
        });
    });

    // Ein- Ausschalter
    $("body").on("click", ".steuerung_btn_schalten", function(event) {
        event.stopImmediatePropagation();
        if($(this).attr('menu')) {
            let status, value, id;
            let str = ".prowo_btn_aus." + $(this).attr('menu');
            value = $(this).attr('status');
            status = Math.trunc(value % 256);            
            value = Math.trunc(value / 256);
            if(status == 1) {
                status = 0;
                $(str).animate({ left : "0px" }, 300);
            }
            else {
                $(str).animate({ left : "15px" }, 300);
                status = 1;
            }  
            value = value * 256 + status;
            $(this).attr('status' , value);              
            let data = {};
            data.id = $(this).attr('menu');
            data.type = 2;      // Schalter ein/aus an ProWo senden
            data.status = value;
            $.ajax({
                method : "POST",
                url : "ajax_nav_steuerung.js",
                dataType: 'html',
                data : JSON.stringify(data),
                contentType: 'application/json'
            }).done(function(data, textStatus) {
                $("#ausgabe").html(data);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                $("#ausgabe").html(errorThrown);
            });
        }
    });
    // slider ist bearbeitet worden
    $("body").on("mouseup touchend", ".slider_steuerung", function(event) {
        event.stopImmediatePropagation();
        if($(this).attr('id'))
        {   let data = {};
            let status, id, value, element;
            id= $(this).attr("id");
            value = document.getElementById(id).value * 256;
            data.id = id.substring(2);
            data.type = 2;      // Schalter ein/aus an ProWo senden
            id = "b_" + data.id;
            element = document.getElementById(id);
            status = element.getAttribute('status') % 256;
            data.status = parseInt(status) + value;
            element.setAttribute('status', data.status);
            $.ajax({
                method : "POST",
                url : "ajax_nav_steuerung.js",
                dataType: 'html',
                data : JSON.stringify(data),
                contentType: 'application/json'
            }).done(function(data, textStatus) {
                $("#ausgabe").html(data);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                $("#ausgabe").html(errorThrown);
            });
        }
    });
    $("body").on("click", ".prowo_btn_up, .prowo_btn_stop, .prowo_btn_down", function(event) {
        event.stopImmediatePropagation();
        if($(this).parent().attr('id'))
        {   let data = {};
            let status, value, id;
            id = $(this).parent().attr("id"); 
            data.id = id.substring(2);
            data.type = 2;      // Schalter ein/aus an ProWo senden  
            status = $(this).attr("status"); // status des Buttons 0,1 oder 2
            value = $(this).parent().attr('status');
            value = Math.trunc(value / 256);
            value = value * 256 + parseInt(status);
            data.status = value;
            $(this).parent().attr('status', value); 
            $.ajax({
                method : "POST",
                url : "ajax_nav_steuerung.js",
                dataType: 'html',
                data : JSON.stringify(data),
                contentType: 'application/json'
            }).done(function(data, textStatus) {
                $("#ausgabe").html(data);
                $(".prowo_btn_img").setImage();
            }).fail(function(jqXHR, textStatus, errorThrown) {
                $("#ausgabe").html(errorThrown);
            });                     
        }       
    });

//
//  HEIZUNG
//
    //  Heizung 1. Ansicht Click auf das Übersichtsfeld
    $("body").on("click", ".btn_heizung_1", function(event) {
        let data = {};
        data.id = $(this).attr('menu');
        data.type = 1;
        $.ajax({
                method : "POST",
                url : "ajax_nav_heizung.js",
                dataType: 'html',
                data : JSON.stringify(data),
                contentType: 'application/json'
            }).done(function(data, textStatus) {
                $("#content").replaceWith(data);   
            }).fail(function(jqXHR, textStatus, errorThrown) {
                $("#ausgabe").html(errorThrown);
        });
    });

    //  Heizung 1. Ansicht Click auf eine Heizkörperzeile
    $("body").on("click", ".btn_heizung_2", function(event) {

        dataGlobal.id = $(this).attr('menu');
        dataGlobal.type = 7;
        $.mobile.navigate("#uhrzeitTemperatur");
        verwaltUhrTemp();
    });

    function verwaltUhrTemp() {
        let i, iAkt, iLen, str;

        dataGlobal.type = 7;
        $.ajax({
            method : "POST",
            url : "ajax_nav_heizung.js",
            dataType: 'html',
            data : JSON.stringify(dataGlobal),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            json = JSON.parse(data);
            jsonLen = json.pkt.length;
            $('#canvasHeizung').attr('menu', json.id);
            $("#selectHeizprogramm").empty();
            $("#selectHeizprogrammTag").empty();
            $("#selectHeizkoerper").empty();
            iAkt = dataGlobal.id.slice(2,3);
            iLen = json.Heizprogramm.length;
            for(i=0; i < iLen; i++){
                if(i+1 == iAkt)
                    str = '<option value="' + (i+1) + '" selected="selected">' + json.Heizprogramm[i].Name + '</option>';
                else
                    str = '<option value="' + (i+1) + '">' + json.Heizprogramm[i].Name + '</option>';
                $('#selectHeizprogramm').append(str);
            }
            $('#selectHeizprogramm').selectmenu('refresh');
            iAkt = dataGlobal.id.slice(4,5);
            iLen = json.HeizprogrammTag.length;
            for(i=0; i < iLen; i++) {
                if(i+1 == iAkt)
                    str = '<option value="' + (i+1) + '" selected="selected">' + json.HeizprogrammTag[i].Name + '</option>';
                else
                   str = '<option value="' + (i+1) + '">' + json.HeizprogrammTag[i].Name + '</option>';
                $('#selectHeizprogrammTag').append(str);
            }
            $('#selectHeizprogrammTag').selectmenu('refresh');
            iAkt = dataGlobal.id.slice(6,7);
            iLen = json.Heizkoerper.length;
            for(i=0; i < iLen; i++) {
                if(i+1 == iAkt)
                    str = '<option value="' + (i+1) + '" selected="selected">' + json.Heizkoerper[i].Name + '</option>';
                else
                   str = '<option value="' + (i+1) + '">' + json.Heizkoerper[i].Name + '</option>';
                $('#selectHeizkoerper').append(str);
            }    
            $('#selectHeizkoerper').selectmenu('refresh');  
            $('#selectHeizprogramm-button').css('display', 'flex');
            $('#selectHeizprogrammTag-button').css('display', 'flex');
            $('#selectHeizkoerper-button').css('display', 'flex');
            aktUhrzeitTemp = 0;
            anzeigeCanvasHeizung();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });
    }

    $("body").on("click", ".btn_heizung_3,.btn_heizung_4", function(event) {
        
        event.preventDefault();
        dataGlobal.id = this.id;
        dataGlobal.type = 5;
        $("#dialogInputTextContent").val($(this).text());
        $("#dialogInputText").popup("open");
    });

    $("body").on("click", ".chk_wochentabelle", function(event) {
        let id;
        let data = {};

        id = $(this).attr('menu');
        data.id = id.slice(0,7);
        data.type = 2;
        data.tag = id.slice(8,9);
        $.ajax({
            method : "POST",
            url : "ajax_nav_heizung.js",
            dataType: 'html',
            data : JSON.stringify(data),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            $("#content").replaceWith(data);   
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
    });

    });

    $("body").on("click", ".btn_signminus", function(event) {

        dataGlobal.id = $(this).attr('menu');
        dataGlobal.type = 3;      // Heizprogramm Wochentage löschen
        $("#dialogSignMinus").popup('open');
    });

    $("body").on("click", ".btn_clock", function(event) {
        
        let datime;
        let datum, jahr, monat, tag, uhrzeit, stunde, minute, menu, str;
        dataGlobal.id = $(this).attr('menu');
        if($(this).attr('datum')) {
            datum = $(this).attr('datum');
            jahr = Math.trunc(datum / 10000);
            monat = Math.trunc(Math.trunc((datum % 10000)) / 100);
            tag = Math.trunc(Math.trunc(datum % 10000) % 100);
            uhrzeit = $(this).attr('uhrzeit');
            stunde = Math.trunc(uhrzeit / 60);
            minute = Math.trunc(uhrzeit % 60);
            menu = $(this).attr('menu');
        }
        else {
            datime = new Date();
            jahr = datime.getFullYear();
            monat = datime.getMonth()+1;
            tag = datime.getDate();
            stunde = datime.getHours();
            minute = datime.getMinutes();
        }
        str = jahr + '-' + addLeadingZeros(monat,2) + '-' + addLeadingZeros(tag, 2);
        $("#datepicker").val(str);
        $("#datepicker").attr('menu', menu);
        str = addLeadingZeros(stunde,2) + ':' + addLeadingZeros(minute,2);
        $("#timepicker").val(str);
        $("#timepicker").attr('menu', menu);
        dataGlobal.type = 6;      // Datum und Uhrzeit für Heizprogramm
        $("#dialogDatumUhrzeit").popup('open');
    });

    $("body").on("click", "#popupOk", function(event) {
        $.ajax({
            method : "POST",
            url : "ajax_nav_heizung.js",
            dataType: 'html',
            data : JSON.stringify(dataGlobal),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            $("#content").replaceWith(data);   
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });
    });
    
    $("body").on("click", "#popupOkInputText", function(event) {

        dataGlobal.Beschreibung = $("#dialogInputTextContent").val();
        $.ajax({
            method : "POST",
            url : "ajax_nav_heizung.js",
            dataType: 'html',
            data : JSON.stringify(dataGlobal),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            $("#content").replaceWith(data);   
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });
    });    
    $("body").on("click", ".btn_signplus", function(event) {
        let str, help;
        let id, i, j, id2, len;

        event.preventDefault();
        dataGlobal.id = $(this).attr('menu');
        dataGlobal.type = 4;
        $("#dialogSignPlusContent").empty();
        str = '<div>';
        for(i=1; i < 10; i++) {
            id = '#2_' + i + '_0_0';
            if($(id).text() != "") {
                help = $(id).text();
                len = help.indexOf('-');
                if(len > 0)
                    help = help.slice(0, len);
                str += '<div class="dialogSPHeizProgramm">' + help + '</div>';
                for(j=1; j<= 7; j++) {
                    id2 = '#2_' + i + '_' + j + '_0';
                    if($(id2).text() != "")
                        str += '<div data-role="button" data-rel="back" role="button" class="dialogSPHeizProgrammTag" menu="' + id2.slice(1) + '">' + $(id2).text() + '</div>';
                    else
                        break;
                }
            }
            else
                break;
        }
        str += '</div>';
        $(str).appendTo("#dialogSignPlusContent");
        $("#dialogSignPlus").popup('open');        
    });

    $("body").on("click", ".dialogSPHeizProgrammTag", function() {

        $("#dialogSignPlus").popup('close'); 
        dataGlobal.idVon = $(this).attr('menu');
        $.ajax({
            method : "POST",
            url : "ajax_nav_heizung.js",
            dataType: 'html',
            data : JSON.stringify(dataGlobal),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            $("#content").replaceWith(data);   
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });    
    });

    $.fn.setStatus = function() {
        return this.each(function() {
            let str = ".prowo_btn_aus." + $(this).attr('menu');
            if(Math.trunc($(this).attr('status') % 256) != 0) {
                $(str).animate({ left : "15px" }, 300);
            }
        });
    }
    $.fn.setImage = function() {
        return this.each(function() {
            let str, id, status, pos;
            str = $(this).attr('src');
            if(str)
            {
                id = $(this).attr('id').substring(2);
                id = "#b_" + id;
                status = $(this).siblings(id).attr('status') % 256;
                pos = str.lastIndexOf(".");
                if(pos > 1)
                {
                    str = str.substring(0, pos-1) + status + str.substring(pos);
                    $(this).attr('src', str);
                }
            }   
        });
    }

    function addLeadingZeros (n, length)
    {
        let str = (n > 0 ? n : -n) + "";
        let zeros = "";
        for (let i = length - str.length; i > 0; i--)
            zeros += "0";
        zeros += str;
        return n >= 0 ? zeros : "-" + zeros;
    }
    $("body").on("click", "#zurueck", function(event) {
        $.mobile.navigate("#startSeite");
    });

    $("body").on("click", "#submitHeizProgramm", function() {
        let datum, jahr, posjahr, posmonat, monat, tag, iDatum, uhrzeit, posminute, stunde, minute, iUhrzeit;

        datum = $("#datepicker").val();
        posjahr = datum.indexOf("-");
        jahr = datum.slice(0, posjahr);
        if(parseInt(jahr) > 2018) {
            posmonat = datum.lastIndexOf("-");
            monat = datum.slice(posjahr+1, posmonat);
            tag = datum.slice(posmonat+1);
            iDatum = ((parseInt(jahr) * 10000) + parseInt(monat) * 100) + parseInt(tag);
            uhrzeit = $("#timepicker").val();
            posminute = uhrzeit.indexOf(":");
            stunde = uhrzeit.slice(0, posminute);
            minute = uhrzeit.slice(posminute+1);
            iUhrzeit = parseInt(stunde) * 60 + parseInt(minute);
            dataGlobal.datum = iDatum;
            dataGlobal.uhrzeit = iUhrzeit;
            $.ajax({
                method : "POST",
                url : "ajax_nav_heizung.js",
                dataType: 'html',
                data : JSON.stringify(dataGlobal),
                contentType: 'application/json'
            }).done(function(data, textStatus) {
                $("#content").replaceWith(data);   
            }).fail(function(jqXHR, textStatus, errorThrown) {
                $("#ausgabe").html(errorThrown);
            });
        }
    });

// **************************************************************************************
// Heizprogramm   Uhrzeit - Temperatur
// **************************************************************************************
    let line, id;
    let aktUhrzeitTemp;
    let ctx;
    const maxTemp = 300; // maximum 30°
    const minTemp = 40;   // minimum 4°
    let xAxeOffset, yAxeOffset;
    let canvasHeight, canvasWidth;
    let xf, yf;
    let InsertUhrzeit = false;
    
    function anzeigeCanvasHeizung() {
        let i, j, k;

        let cv = document.getElementById("canvasHeizung");
        canvasHeight = $(window).height() -250;
        canvasWidth = $(window).width();
        $('#picker_uhrzeittemp').remove();
        cv.height = canvasHeight;
        cv.width = canvasWidth; 
        canvasHeight -= 20;
        ctx = cv.getContext("2d");  
        yAxeOffset = 15;
        xAxeOffset = 25;
        yf = (canvasHeight-yAxeOffset) / maxTemp;
        xf = (canvasWidth-xAxeOffset) / 1440;
        ctx.font = "15px ";
        ctx.fillStyle = "black";
        for(i=1; i < 7; i++)
            ctx.fillText((i*5).toString() + "°C", 0, canvasHeight - i*50*yf, 19);
        ctx.beginPath();
        ctx.strokeStyle = "black"; 
        ctx.beginPath();
        for(i=1; i < 31;i++)
        {   
            ctx.beginPath();
            if(i % 10 == 0)
            {   j = canvasWidth;
                ctx.strokeStyle = "#C0C0C0";
            }
            else if(i % 5 == 0)
            {   j = canvasWidth;
                ctx.strokeStyle = "#E8E8E8";
            }
            else
            {   j = 3;
                ctx.strokeStyle= "black";
            }
            ctx.moveTo(xAxeOffset, canvasHeight - i*10*yf);
            ctx.lineTo(xAxeOffset+j, canvasHeight - i*10*yf);
            ctx.stroke();
        }
        ctx.moveTo(xAxeOffset, 0);
        ctx.lineTo(xAxeOffset, canvasHeight);
        ctx.lineTo(canvasWidth, canvasHeight);
        for(i=24; i > 0; i--)
        {
            if(i%2 == 0)
                k = 0;
            else 
                k = canvasHeight-5;
            j = i*60*xf + xAxeOffset;
            ctx.moveTo(j, canvasHeight+5);
            ctx.lineTo(j, k);
        }  
        ctx.stroke(); 
        for(i=0; i < 24;i +=2)
        {
            j = i*60*xf + xAxeOffset-5;
            ctx.fillText(i, j, canvasHeight + yAxeOffset);
        } 
        InsertUhrzeit = false;
        anzeigeUhrzeitTempKurve();
    }
  
    function anzeigeUhrzeitTempKurve()
    {   
        let i, len;
        let timeStart, timeEnd;
        let tempStart, tempEnd;

        len = json.pkt.length;
        ctx.beginPath();
        for(i=0; i < 2*len; i++)
        {
            if(json.pkt[parseInt(i/2)].time === 0 && json.pkt[parseInt(i/2)].temp === 0)
                break;
            timeStart = json.pkt[parseInt(i/2)].time;
            tempEnd = 0;
            if(i === 2*len-2)
                timeEnd = 1439;
            else if(json.pkt[parseInt(i/2)+1].time === 0)
                timeEnd = 1439;
            else
            {
                 timeEnd = json.pkt[parseInt(i/2)+1].time;
                 tempEnd = json.pkt[parseInt(i/2)+1].temp;
            }
            tempStart = json.pkt[parseInt(i/2)].temp;
            ctx.beginPath();
            if(aktUhrzeitTemp === i)
            {
                 ctx.strokeStyle = "red";
                 setAnzeigeUhrzeitTemp(true);
            }
            else
                ctx.strokeStyle = "blue";
            ctx.moveTo(timeStart*xf + xAxeOffset,  canvasHeight - tempStart*yf);
            ctx.lineTo(timeEnd*xf + xAxeOffset, canvasHeight - tempStart*yf);
            ctx.stroke();
            ctx.beginPath();
            i++;
            if(tempEnd)
            {
                if(aktUhrzeitTemp === i)
                {
                    ctx.strokeStyle = "red";
                    setAnzeigeUhrzeitTemp(false);
                }
                else
                    ctx.strokeStyle = "blue";
                ctx.moveTo(timeEnd*xf + xAxeOffset, canvasHeight - tempStart*yf);                                    
                ctx.lineTo(timeEnd*xf + xAxeOffset, canvasHeight - tempEnd*yf);
            }
            ctx.stroke();
        }

    }

    $("body").on("change", "#selectHeizprogramm", function(event) {
        let Heizprogramm = $('#selectHeizprogramm').find('option:selected').val();
        let Heizkoerper = $('#selectHeizkoerper').find('option:selected').val();
        dataGlobal.id = '2_' + Heizprogramm + '_1_' + Heizkoerper;
        verwaltUhrTemp();
    });

    $("body").on("change", "#selectHeizprogrammTag,#selectHeizkoerper", function(event) {
        let Heizprogramm = $('#selectHeizprogramm').find('option:selected').val();
        let HeizprogrammTag = $('#selectHeizprogrammTag').find('option:selected').val();
        let Heizkoerper = $('#selectHeizkoerper').find('option:selected').val();
        dataGlobal.id = '2_' + Heizprogramm + '_' + HeizprogrammTag + '_' + Heizkoerper;
        verwaltUhrTemp();
    });

    // Taste nächste Linie
    $("body").on("click", "#naechsteLinie", function() {
        if(InsertUhrzeit)
        {
            InsertUhrzeit = false;
            if(aktUhrzeitTemp)
                aktUhrzeitTemp--;
        }
        if(aktUhrzeitTemp < 18)
        {   if(aktUhrzeitTemp % 2 === 0)
            {
                if(json.pkt[parseInt(aktUhrzeitTemp/2)+1].time !== 0)
                   aktUhrzeitTemp++;
            }
            else
                aktUhrzeitTemp++;
            $('#picker_uhrzeittemp').remove();
            anzeigeCanvasHeizung();
        }
    });

    // Taste vorige Linie 
    $("body").on("click", "#vorigeLinie", function() {
        if(InsertUhrzeit)
        {
            InsertUhrzeit = false;
            if(aktUhrzeitTemp)
                aktUhrzeitTemp--;
        }
        if(aktUhrzeitTemp > 0)
        {
            $('#picker_uhrzeittemp').remove();
            aktUhrzeitTemp--;
            anzeigeCanvasHeizung();
        }
    });

    $("body").on("click", "#refresh_uhrzeittemp", function() {
        if(InsertUhrzeit)
            $("#insert_uhrzeittemp").trigger("click");  
        else
        {          
            if(parseInt(aktUhrzeitTemp % 2) === 0) {
                let wert = $("#picker_uhrzeittemp").val() * 10;
                wert = parseInt(wert);
                if(wert >= minTemp && wert <= maxTemp) {
                    if(!json.HKType) {
                        if(wert < 120)
                            wert = 40;
                        else
                            wert = 200;
                    }
                    json.pkt[parseInt(aktUhrzeitTemp/2)].temp = wert;
                    controlUhrzeitTemp();
                }
                else
                    $("#picker_uhrzeittemp").val("");
            }
            else {
                let uhrzeit = $("#picker_uhrzeittemp").val();
                let posminute = uhrzeit.indexOf(":");
                if(posminute > 0) {
                    let stunde = uhrzeit.slice(0, posminute);
                    let minute = uhrzeit.slice(posminute+1);
                    let iUhrzeit = parseInt(stunde) * 60 + parseInt(minute);
                    if(iUhrzeit >= 0 && iUhrzeit <= 1440) {
                        json.pkt[parseInt(aktUhrzeitTemp/2)+1].time = iUhrzeit;
                        controlUhrzeitTemp();
                    }   
                    else 
                        $("#picker_uhrzeittemp").val("");
                }
            }
        }
    });

    $('#contentUhrzeitTemperatur').bind('resize', anzeigeCanvasHeizung);

    $("body").on('click', '#insert_uhrzeittemp', function(){
        let i, j, str;
        let anzeigeElement;

        InsertUhrzeit = false;
        if(!json.pkt[jsonLen-1].temp)
        {
            if(parseInt(aktUhrzeitTemp%2) === 0)
            {
                $('#picker_uhrzeittemp').remove();
                aktUhrzeitTemp++;
                InsertUhrzeit = true;
                anzeigeElement = $('<input type="time" id="picker_uhrzeittemp">');
                anzeigeElement.appendTo('#anzeige_uhrzeittemp');               
            }
            else
            {
                let uhrzeit = $("#picker_uhrzeittemp").val();
                let posminute = uhrzeit.indexOf(":");
                if(posminute > 0) {
                    let stunde = uhrzeit.slice(0, posminute);
                    let minute = uhrzeit.slice(posminute+1);
                    let iUhrzeit = parseInt(stunde) * 60 + parseInt(minute);
                    if(iUhrzeit >= 0 && iUhrzeit < 1440) {
                        for(j=0; j < jsonLen-1; j++ ) {
                            if(json.pkt[j].time === iUhrzeit)
                                return;
                            if((json.pkt[j].time > iUhrzeit) ||  (j > 0 && json.pkt[j].time === 0) )
                                break;
                        }
                        for(i = jsonLen-2; i >= j; i--) {
                            json.pkt[i+1].temp = json.pkt[i].temp;
                            json.pkt[i+1].time = json.pkt[i].time
                        }
                        if(json.HKType) {
                            if(json.pkt[i].temp > (minTemp + maxTemp)/2)
                                json.pkt[i+1].temp  = json.pkt[i].temp - 30;
                            else
                                json.pkt[i+1].temp  = json.pkt[i].temp + 30; 
                            if(i < jsonLen-2 && json.pkt[i+1].temp === json.pkt[i+2].temp) 
                                json.pkt[i+1].temp -= 10;
                        }
                        else {
                            if(json.pkt[i].temp > 120)
                                json.pkt[i+1].temp = 40;
                            else
                                json.pkt[i+1].temp = 200;
                        }
                        json.pkt[i+1].time = iUhrzeit; 
                        controlUhrzeitTemp();
                    }
                }
            }
        }
    });
 
    // Daten nach dem Server senden
    $("body").on("click", "#submitUhrzeitTemp", function() {
       
        dataGlobal.type = 8;      
        dataGlobal.json = JSON.stringify(json);
        $.ajax({
            method : "POST",
            url : "ajax_nav_heizung.js",
            dataType: 'html',
            data : JSON.stringify(dataGlobal),
            contentType: 'application/json'
        }).done(function(data, textStatus) {
            $("#ausgabe").html(data);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $("#ausgabe").html(errorThrown);
        });
    });   

    function setAnzeigeUhrzeitTemp(status) {
        let anzeigeElement;

        if(parseInt(aktUhrzeitTemp % 2) === 0) 
            anzeigeElement = $('<input type="number" id="picker_uhrzeittemp">');        
        else
            anzeigeElement = $('<input type="time" id="picker_uhrzeittemp">');
        anzeigeElement.appendTo('#anzeige_uhrzeittemp');
        anzeigeWert();
    }

    function anzeigeWert() {
        let str;
        if(parseInt(aktUhrzeitTemp % 2) !== 0) {
            let uhrzeit = json.pkt[parseInt(aktUhrzeitTemp/2)+1].time;
            let stunde = Math.trunc(uhrzeit / 60);
            let minute = Math.trunc(uhrzeit % 60);
            str = addLeadingZeros(stunde,2) + ':' + addLeadingZeros(minute,2);
         }
        else {
            let temp = json.pkt[parseInt(aktUhrzeitTemp/2)].temp;
            str = temp/10;
        }
        $('#picker_uhrzeittemp').val(str);
    }

    function controlUhrzeitTemp() {
        let i, wechsel = true;  
        let iPos, str=null;

        while(wechsel) {
            wechsel = false;
            for(i=0; i < jsonLen-1; i++) {
                if(json.pkt[i+1].temp && json.pkt[i].time >= json.pkt[i+1].time) 
                    wechsel = true;
                if(json.pkt[i].temp && json.pkt[i].temp === json.pkt[i+1].temp)
                {
                     wechsel = true;
                     i++;
                }
                if(wechsel)
                {   if(aktUhrzeitTemp >= i*2)
                        aktUhrzeitTemp -= 2;
                    for( ; i < jsonLen-1; i++) {
                        json.pkt[i].time = json.pkt[i+1].time;
                        json.pkt[i].temp = json.pkt[i+1].temp;
                    }
                    json.pkt[i].time = 0;
                    json.pkt[i].temp = 0;
                    break;
                }
            }
        }
        json.pkt[0].time = 0;
        anzeigeCanvasHeizung();
    }
});
