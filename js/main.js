!function (window,document,undefined) {
//main enclosure
"use strict";

window.onload = function() {

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
    console.log(ip[0]);
    console.log(codes[0]);
    //TODO determine location from ip and set preselected currency by using ISO table

  })
  .fail(function() {
    //if fail retry for main currency API ONLY
    $.ajax({
      url: "https://api.coinbase.com/v2/currencies",
      dataType: 'json'
    })
    .done(function(curr) {
      printCurrencylists(curr);
    })
    .fail(function() {
      console.log("ERROR");
      //TODO CREATE API DOWN MESSAGE IN DOM HERE
    });
  });
}




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
      var li = document.createElement("LI");
      li.setAttribute("data-value", Object.keys(currencies[i]));
      var text = Object.keys(currencies[i]) + " - " + currencies[i][Object.keys(currencies[i])];
      var t = document.createTextNode(text);
      li.appendChild(t);
      document.getElementsByClassName('currencylist')[j].appendChild(li);
    };
  };
};



//end main enclosure
} (this,document)
