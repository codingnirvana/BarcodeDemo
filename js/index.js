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

    HOST_URL : "http://41760a89.ngrok.com/products/",
    type: 'barcode',

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    initializeButtons: function(type){
      switch(type){
        case 'barcode':
          $('.scan').parent().find('.ui-btn-text').html('Scan bar code');
          $('input.ui-input-text.text-search').css('display','none');
          $('.scan').off('click').on('click', this.scan);
          break;
        case 'upc':
          $('.scan').parent().find('.ui-btn-text').html('Scan bar code');
          $('input.ui-input-text.text-search').css('display','none');
          $('.scan').off('click').on('click', this.upcSearch);
          break;
        case 'image':
          $('.scan').parent().find('.ui-btn-text').html('Scan image');
          $('input.ui-input-text.text-search').css('display','none');
          $('.scan').off('click').on('click', this.imageSearch);
          break;
        case 'text':
          $('input.ui-input-text.text-search').css('display','block');
          $('.scan').parent().find('.ui-btn-text').html('Scan Text');
          $('.scan').off('click').on('click', this.textSearch);
          break;
        case 'ocr':
          $('.scan').parent().find('.ui-btn-text').html('Scan OCR');
          $('input.ui-input-text.text-search').css('display','none');
          $('.scan').off('click').on('click', this.imageSearch);
          break;
      }
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('scan').addEventListener('click', this.scan, false);
        document.getElementById('encode').addEventListener('click', this.encode, false);
    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
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

    upcSearch: function(){
      app.scan({'isUPC': true});
    },

    textSearch: function(){
      var text = $('.text-search').val();
      var url = app.HOST_URL + "text?q=" + text;
      $.ajax({
        url: url,
        dataType: "json",
        success: function(response){
          if(!response) response = {};
          $('.scan').parent().find('.ui-btn-text').html('scan success.');
          $('.products h1').html(response.title);
          if(response.author)
            $('.products .author').html("Author: " + response.author);
          if(response.minPrice)
            $('.products .minPrice').html("Best Price: &#x20B9;" + response.minPrice);
          $('.products-list').empty();
          $(response.offers).each(function(){
            var el =  '<li>\
                    <a href="' + this.storeUrl + '">\
                      <img class="store-image" src="' + this.storeLogoUrl + '" />\
                      <label class="store-name">' + this.storeName + '</label>\
                      <label class="price">&#x20B9;' + this.price + '</label>\
                    </a>\
                  </li>'
            $('.products-list').append(el);
          })
           $('.products-list').listview('refresh');
        },
        error: function(msg){
          $('.scan').parent().find('.ui-btn-text').html('scan error.');
          alert("Error in ajax:" + JSON.stringify(msg));
        }
      });
    },

    imageSearch: function(){
      function onSuccess(imageURI) {
        alert('imageURI:' + imageURI);
        var image = document.getElementById('myImage');
        image.src = imageURI;
      }

      function onFail(message) {
        alert('Image Failed because: ' + message);
      }

      alert('Image : ' + navigator);
      alert('Image : ' + navigator.camera);
      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI
      });
    },


    scan: function(options) {
        console.log('scanning');

        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan( function (result) {

            alert("Save  The Hacker " + "\n" +
            "We got a barcode\n" +
            "Result: " + result.text + "\n" +
            "Format: " + result.format + "\n" +
            "Cancelled: " + result.cancelled);
            if(!result) result = {};
            $('.scan').parent().find('.ui-btn-text').html('scanning...')
            var url = "";
            if((options || {}).isUPC)
              url = app.HOST_URL + "upc?q=" + (result.text ? result.text : '6438158564411');
            else
              url = app.HOST_URL + "barcode?q=" + (result.text ? result.text : '9788190453011');
            $.ajax({
              url: url,
              dataType: "json",
              success: function(response){
          // var response = app.sample;
                if(!response) response = {};
                $('.scan').parent().find('.ui-btn-text').html('scan success.');
                $('.products h1').html(response.title);
                if(response.author)
                  $('.products .author').html(((options || {}).isUPC ? "Manufacturer: " : "Author: ") + response.author);
                if(response.minPrice)
                  $('.products .minPrice').html("Best Price: &#x20B9;" + response.minPrice);
                $('.products-list').empty();
                $(response.offers).each(function(){
                  var el =  '<li>\
                          <a href="' + this.storeUrl + '">\
                            <img class="store-image" src="' + this.storeLogoUrl + '" />\
                            <label class="store-name">' + this.storeName + '</label>\
                            <label class="price">&#x20B9;' + this.price + '</label>\
                          </a>\
                        </li>'
                  $('.products-list').append(el);
                })
                 $('.products-list').listview('refresh');
              },
              error: function(msg){
                $('.scan').parent().find('.ui-btn-text').html('scan error.');
                alert("Error in ajax:" + JSON.stringify(msg));
              }
            })

           console.log("Scanner result: \n" +
                "text: " + result.text + "\n" +
                "format: " + result.format + "\n" +
                "cancelled: " + result.cancelled + "\n");
            document.getElementById("info").innerHTML = result.text;
            console.log(result);
        }, function (error) {
            console.log("Scanning failed: ", error);
        } );
    },

    encode: function() {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.nhl.com", function(success) {
            alert("encode success: " + success);
          }, function(fail) {
            alert("encoding failed: " + fail);
          }
        );
    }
};
