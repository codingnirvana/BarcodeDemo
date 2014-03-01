/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

    HOST_URL : "http://192.168.6.72:3000/products",
    type: 'barcode',

    // Application Constructor
    initialize: function(type) {
        this.bindEvents();
        switch(type){
          case 'barcode':
            $('.scan').parent().find('.ui-btn-text').html('Scan bar code');
            $('input.ui-input-text.text-search').css('display','none');
            $('.scan').off('click').on('click', this.scan);
            break;
          case 'image':
            $('.scan').parent().find('.ui-btn-text').html('Scan image');
            $('input.ui-input-text.text-search').css('display','none');
            $('.scan').off('click').on('click', this.imageSearch);
            break;
          case 'text':
            $('input.ui-input-text.text-search').css('display','block');
            $('.scan').parent().find('.ui-btn-text').html('Search');
            $('.scan').off('click').on('click', this.textSearch);
            break;
        }
    },

    getURLParameter: function(sParam){
      var sPageURL = window.location.search.substring(1);
      var sURLVariables = sPageURL.split('&');
      for (var i = 0; i < sURLVariables.length; i++){
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam){
          return sParameterName[1];
        }
      }
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        //document.getElementById('scan').addEventListener('click', this.scan, false);
        //document.getElementById('imageSearch').addEventListener('click', this.imageSearch, false);
        $('#imageSearch').off('click').on('click', this.imageSearch);

    },

    textSearch: function(){

    },

    imageSearch: function(){
      $.ajax({
        url: 'http://api.indix.com/api/beta/products/?query=nike&app_id=54213813&app_key=7f5198b4650d239a4bf43bfbeced29bb',
        dataType: "json",
        success: function(response){
          alert((response || {}).status);
        },
        error: function(msg){
          alert("Error in ajax:" + JSON.stringify(msg));
        }
      })
    },

    scan: function() {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan( function (result) {

            alert("Save  The Hacker " + "\n" +
            "We got a barcode\n" +
            "Result: " + result.text + "\n" +
            "Format: " + result.format + "\n" +
            "Cancelled: " + result.cancelled);

           console.log("Scanner result: \n" +
                "text: " + result.text + "\n" +
                "format: " + result.format + "\n" +
                "cancelled: " + result.cancelled + "\n");
            $('.scan').parent().find('.ui-btn-text').html('scanning...')
            $.ajax({
              url: app.HOST_URL + "&q=" + 'a',
              dataType: "json",
              success: function(response){
                $('.scan').parent().find('.ui-btn-text').html('scan success.');
                alert((response || {}).status);
              },
              error: function(msg){
                $('.scan').parent().find('.ui-btn-text').html('scan error.');
                alert("Error in ajax:" + JSON.stringify(msg));
              }
            })
            /*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */

        }, function (error) {
            console.log("Scanning failed: ", error);
        } );
    },

    encode: function() {
        // var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        // scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.nhl.com", function(success) {
        //     alert("encode success: " + success);
        //   }, function(fail) {
        //     alert("encoding failed: " + fail);
        //   }
        // );

    }

};

$(function(){
  app.initialize();
})

