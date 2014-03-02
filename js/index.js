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

    HOST_URL : "http://41760a89.ngrok.com/products",
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
        console.log('scanning');
        alert('scanning');

        // var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        // scanner.scan( function (result) {

        //     alert("Save  The Hacker " + "\n" +
        //     "We got a barcode\n" +
        //     "Result: " + result.text + "\n" +
        //     "Format: " + result.format + "\n" +
        //     "Cancelled: " + result.cancelled);
            //if(!result) result = {};
            $('.scan').parent().find('.ui-btn-text').html('scanning...')
            $.ajax({
              url: app.HOST_URL + "?q=" + '9788190453011',
              dataType: "json",
              success: function(response){
                if(!response) response = {};
                $('.scan').parent().find('.ui-btn-text').html('scan success.');
                $('.products h1').html(response.title);
                $('.products-list').empty();
                $(response.offers).each(function(){
                  var el =  '<li>\
                          <a href="' + this.storeUrl + '">\
                            <img class="store-image" src="' + this.storeLogoUrl + '" />\
                            <label class="store-name">' + this.storeName + '</label>\
                            <label class="price">$' + this.price + '</label>\
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

           // console.log("Scanner result: \n" +
           //      "text: " + result.text + "\n" +
           //      "format: " + result.format + "\n" +
           //      "cancelled: " + result.cancelled + "\n");
           //  document.getElementById("info").innerHTML = result.text;
           //  console.log(result);
        // }, function (error) {
        //     console.log("Scanning failed: ", error);
        // } );
    },

    encode: function() {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.nhl.com", function(success) {
            alert("encode success: " + success);
          }, function(fail) {
            alert("encoding failed: " + fail);
          }
        );

    },

    sample: {
title: "Stay Hungry Stay Foolish",
imageUrl: "",
author: "Rashmi Bansal",
minPrice: "Best Price: Rs. 63",
offers: [
{
storeName: "amazonkindle",
storeLogoUrl: "http://c223968.r68.cf1.rackcdn.com/amazon_kindle_store.png",
price: "63",
storeUrl: "http://www.mysmartprice.com/out/sendtostore.php?store=amazon&top_category=books&url=http://www.amazon.in/Stay-Hungry-Foolish-rashmi-Bansal-ebook/dp/B008R86NJ4/ref=tmm_kin_title_0/277-5981452-0776555"
},
{
storeName: "amazon",
storeLogoUrl: "http://c223968.r68.cf1.rackcdn.com/amazon_store.png",
price: "96",
storeUrl: "http://www.mysmartprice.com/out/sendtostore.php?store=amazon&top_category=books&url=http://www.amazon.in/gp/product/8190453017&store=amazon"
},
{
storeName: "infibeam",
storeLogoUrl: "http://c0028655.cdn1.cloudfiles.rackspacecloud.com/infibeam_store.png",
price: "113",
storeUrl: "http://www.mysmartprice.com/out/sendtostore.php?store=infibeam&top_category=books&url=http://www.infibeam.com/Books/info/rashmi-bansal/stay-hungry-stay-foolish/9788190453011.html&store=infibeam"
},
{
storeName: "uread",
storeLogoUrl: "http://c0028655.cdn1.cloudfiles.rackspacecloud.com/uread_store.png",
price: "116",
storeUrl: "http://www.mysmartprice.com/out/sendtostore.php?store=uread&top_category=books&url=http://www.uread.com/book/hungry-stay-foolish-bansal-rashmi/9788190453011&store=uread"
},
{
storeName: "bookadda",
storeLogoUrl: "http://c0028655.cdn1.cloudfiles.rackspacecloud.com/bookadda_store.png",
price: "119",
storeUrl: "http://www.mysmartprice.com/out/sendtostore.php?store=bookadda&top_category=books&url=http://www.bookadda.com/books/stay-hungry-stay-rashmi-bansal-8190453017-9788190453011&store=bookadda"
},
{
storeName: "ebay",
storeLogoUrl: "http://c223968.r68.cf1.rackcdn.com/ebay_store.png",
price: "125",
storeUrl: "http://www.mysmartprice.com/out/sendtostore.php?store=ebay&top_category=books&url=http%3A%2F%2Frover.ebay.com%2Frover%2F1%2F4686-145536-10941-3%2F2%3F%26site%3DPartnership_MSP_Books%26mpre%3Dhttp%3A%2F%2Fread.ebay.in%2Fisbn%3Fisbn%3D9788190453011&store=ebay"
}
]
}

};
