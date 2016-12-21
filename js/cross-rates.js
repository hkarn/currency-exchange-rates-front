/*
Author: Håkan Arnoldson
For Webaplications at Lernia YH
*/
!function (window,document,undefined) {
//main closure
"use strict";

window.onload = function() {

  var cols = getUrlVars()["base"];
  var rows = getUrlVars()["pair"];

  console.log(cols);
  console.log(rows);

  //PREFORM SANITY CHECK ON URL AGAINST /currencies
  //PREFORM SANITY CHECK ON URL AGAINST /currencies
  //PREFORM SANITY CHECK ON URL AGAINST /currencies
  //PREFORM SANITY CHECK ON URL AGAINST /currencies
  //PREFORM SANITY CHECK ON URL AGAINST /currencies

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

}

 function ajax (cols, rows, i) {
   var xhr = new XMLHttpRequest(),
   method = "GET",
   url = "https://api.coinbase.com/v2/exchange-rates?currency=" + cols[i].trim();
    xhr.open(method, url, true);
    xhr.onreadystatechange = (function (cols, rows, i) {
      return function() {                                                               //onreadystatechange is a closure. the return function ()
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {              //is necessary to run code inside this closure
          var data = JSON.parse(xhr.responseText);                                      //variable are feeded into the closure and it ends with calling the
                                                                                        //ajax function again initation a new call with i++ on completion of a call
          printColumn(cols[i], rows, data.data.rates);                                  //until desired number of calls is reached
          i++;                                                                          //each call prints a column in the table with exchange rate data collected for the
          if (i < cols.length) {                                                        //current position in cols
            ajax(cols, rows, i);
          } else {                                                                      //this slower then making all calls at once but gives more control booth of the order
                                                                                        //and spammy behaviour. maybe this kind of this is better pre-processed in a back-end that can also filter absusive request?
            // LOADING COMPLETED ()
            // LOADING COMPLETED ()
            // LOADING COMPLETED ()
            // LOADING COMPLETED ()
            // LOADING COMPLETED ()
            document.body.style.backgroundColor = "beige";

          };
        } else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status != 200) {
          console.log("FAILED API!");
          //API IS DEAD
          //API IS DEAD
          //API IS DEAD
          document.body.style.backgroundColor = "black";
        };
      };
    })(cols, rows, i);
    xhr.send();
  }



function printColumn(col, rows, rates) {
  console.log(rates);
  // format rates

  var ratesout = [];
  for (var i = 0; i < rows.length; i++) {
    ratesout[i] = rates[rows[i]]; //selects by key in object and assigns to position in array;
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


  //end main closure
} (this,document);
