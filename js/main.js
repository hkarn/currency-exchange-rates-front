/*
Author: Håkan Arnoldson
For Webaplications 1 at Lernia YH
*/

!function (window,document,undefined) {
//main enclosure
"use strict";

window.onload = function() {


  /* get main data */
  $.when(
    $.ajax({
      url: "https://api.coinbase.com/v2/currencies",
      dataType: 'json'
    }),
    $.ajax({
      url: "https://ipinfo.io",
      dataType: 'json'
    }),
    $.ajax({
      url: "data/country-codes.csv",
      dataType: 'text'
  }))
  .done(function(curr, ip, codes) {
    printCurrencylists(curr[0]); //$.when creates a "success" array on top of the data. The regular parsed response is at position 0

    //move on to try to help out by setting default currencies based on geo-location from ipinfo.io
    var arrValidCurrencies = curr[0].data.map( function (item) {
      return item.id.trim();
    });

    var arrContryCurrency = codes[0].split('\n'); //[0] because $.when adds an array to track success
    for (var i = 0; i < arrContryCurrency.length; i++) {
      arrContryCurrency[i] = arrContryCurrency[i].split(',');  //creates a multi-dimensional array arrContryCurrency[pair][0=country, 1=currency]

      if ((arrContryCurrency[i][0].trim() == ip[0].country.trim()) && (arrValidCurrencies.indexOf(arrContryCurrency[i][1].trim()) != -1)) {
        //check right away so we dont need to iterate again, also checks if the currency is availiable from the API and in our values
          document.getElementById('from-currency').value = arrContryCurrency[i][1].trim();
          document.getElementById('to-currency').value = arrContryCurrency[i][1].trim();
          break; //if found we can stop this
      };
    };

    loadingComplete(); //removes loading screen and shows the site
  })
  .fail(function() {
    //if fail retry for main currency API ONLY
    $.ajax({
      url: "https://api.coinbase.com/v2/currencies",
      dataType: 'json'
    })
    .done(function(curr) {
      printCurrencylists(curr);
      loadingComplete();
    })
    .fail(function() {
      loadingFailed();
    });
  });

  $.getJSON("https://api.coinbase.com/v2/prices/BTC-USD/spot")
    .done(function(data) {
      eraseAllChildren(document.getElementById("bitcoin-price"));
      var price = data.data.amount;
      var t = document.createTextNode(price);
      document.getElementById("bitcoin-price").appendChild(t);
    })
    .fail(function() {
      eraseAllChildren(document.getElementById("bitcoin-price"));
      var t = document.createTextNode("n/a");
      document.getElementById("bitcoin-price").appendChild(t);
    });



}
//end window.onload




/*
 Function: printCurrencylists
 Takes the json data from https://api.coinbase.com/v2/currencies
 Writes currency code and description into the DOM in every ul with class currencylist
*/
function printCurrencylists(curr) {
  //map ex {SEK: Swedish Kroner} from response to new array
  var currencies = curr.data.map(function(item) {
    var rObj = {};
    rObj[item.id] = item.name;
    return rObj;
  });
  for (var j = 0; j < document.getElementsByClassName('currencylist').length; j++) {
    for(var i = 0; i < currencies.length; i++) {
      var li = document.createElement("OPTION");
      li.setAttribute("value", Object.keys(currencies[i]));
      var text = Object.keys(currencies[i]) + " - " + currencies[i][Object.keys(currencies[i])];
      var t = document.createTextNode(text);
      li.appendChild(t);
      document.getElementsByClassName('currencylist')[j].appendChild(li);
    };
  };
};

/*
  Function loadingComplete
  Hides the loading section and displays the currency sections.
*/
function loadingComplete() {
  $("#main-header").fadeOut("fast");
  $(".loading").fadeOut("fast", function() {
    $("#main-nav").fadeIn("slow");
    $(".converter").fadeIn("slow");
    $(".crossrates").fadeIn("slow");
    $("#main-footer").fadeIn("slow");
  });
};

/*
  Function loadingFailed
  Ohh noes! The main currency API is down!
*/
function loadingFailed() {
  eraseAllChildren(document.getElementsByClassName('loading')[0]);
  var t1 = document.createTextNode ("Ohh no! Coinbase appears to be sleeping, please ");
  var t2 = document.createTextNode ("try again");
  var t3 = document.createTextNode (".");

  var a = document.createElement("A");
  a.setAttribute('href', '.');
  a.appendChild(t2);

  var h4 = document.createElement("H4");
  h4.appendChild(t1);
  h4.appendChild(a);
  h4.appendChild(t3);

  var i = document.createElement("I");
  i.setAttribute('class', 'fa fa-frown-o fa-5x'); //big sadface :(
  i.setAttribute('aria-hidden', 'true');

  document.getElementsByClassName('loading')[0].appendChild(i);
  document.getElementsByClassName('loading')[0].appendChild(h4);
};

/*
  Function eraseAllChildren
  Delete all content inside a provided element
*/
function eraseAllChildren(node) {
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  };
};


//end main enclosure
} (this,document);
