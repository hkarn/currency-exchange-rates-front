/*
Author: Håkan Arnoldson
For Webaplications at Lernia YH
*/
!function (window,document,undefined) {
//main enclosure
"use strict";

window.onload = function() {

  var cols = getUrlVars()["base"];
  var rows = getUrlVars()["pair"];

  console.log(cols);
  console.log(rows);

  //PREFORM SATITY CHECK AGAINST /currencies
  //PREFORM SATITY CHECK AGAINST /currencies
  //PREFORM SATITY CHECK AGAINST /currencies
  //PREFORM SATITY CHECK AGAINST /currencies
  //PREFORM SATITY CHECK AGAINST /currencies

  cols = cols.split(',');
  rows = rows.split(',');

  var thead = document.getElementById('tHead');
  var tbody = document.getElementById('tBody');

  //print first cell
  var tr = document.createElement("TR");
  var td = document.createElement("TD");
  tr.appendChild(td);
  thead.appendChild(tr);

  //print first columns

  for (var i = 0; i < rows.length; i++) {
    var t = document.createTextNode(rows[i]);
    var tr = document.createElement("TR");
    var th = document.createElement("TH");
    th.setAttribute("scope", "row");
    th.appendChild(t);
    tr.appendChild(th);
    tbody.appendChild(tr);
  };


var i = 0;
ajax(cols, rows, i);

 function ajax (cols, rows, i) {
   var xhr = new XMLHttpRequest(),
   method = "GET",
   url = "https://api.coinbase.com/v2/exchange-rates?currency=" + cols[i].trim();
    xhr.open(method, url, true);
    xhr.onreadystatechange = (function (cols, rows, i, ajax) {
      return function() {                           //WHY DO WE NEED A RETURN HERE?
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);

          printColumn(cols[i], rows, data.data.rates);
          i++;
          if (i < cols.length) {
            ajax(cols, rows, i);
          } else {
            // LOADING COMPLETED ()
          };
        } else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status != 200) {
          console.log("FAILED API!");
        };
      };
    })(cols, rows, i, ajax);
    xhr.send();
  }

}

function printColumn(col, rows, rates) {
  console.log(rates);
  // format rates

  var ratesout = [];
  for (var i = 0; i < rows.length; i++) {
    ratesout[i] = rates[rows[i]]; //selects by key in object and assigns to possition in array;
  }

  // print to DOM
  var theadrow = document.getElementById('tHead').getElementsByTagName('tr')[0];
  var tbody = document.getElementById('tBody');

  var t = document.createTextNode(col)
  var th = document.createElement("TH");
  th.setAttribute('scope', 'col');
  th.appendChild(t);
  theadrow.appendChild(th);

  for (var i = 0; i < rows.length; i++) {
    var t = document.createTextNode(ratesout[i]);
    var tr = document.createElement("TR");
    var td = document.createElement("TD");
    td.appendChild(t);
    tbody.getElementsByTagName('tr')[i].appendChild(td);
  };


};

  /*
    START SNIPPLET
    This function is a borrowed snipplet
    https://gist.github.com/kaioe/8401201
  */
  function getUrlVars()
    {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
        hash[1] = unescape(hash[1]);
        vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }

        return vars;
    }
    var urlVars = getUrlVars();
  /* END SNIPPLET */


  //end main enclosure
} (this,document);
