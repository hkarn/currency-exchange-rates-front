/*
Author: Håkan Arnoldson
For Web applications at Lernia YH
*/
!function (window,document,undefined) {
//main closure
"use strict";

window.onload = function() {

  loaderAnimation();

  var cols = getUrlVars()["base"];
  var rows = getUrlVars()["pair"];

  /* We need to do a basic sanity check on URL variables
     This just checks the format, we will do some further checks if we get a 400
     response when sending them to the API
  */

  var sanity = true;
  if (cols === undefined || rows === undefined || cols == "" || rows == "") {
    sanity = "It appears you haven't selected enough currencies. Please <a href='index.html'>go back</a> and try again.";
  };

  cols = cols.split(',');
  rows = rows.split(',');

  var allinputs = cols.concat(rows);

  for (var i = 0; i < allinputs.length; i++) {
    if (!(/^[A-Z]{3}$/).test(allinputs[i].trim())) {                            //RegExp check for 3 capital letters A-Z
      sanity = "There are inputs that doesn't appear to be currency codes. Please <a href='index.html'>go back</a> and try again.";
    }
  }

  if (sanity === true) {

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

    //set colspan of footer to future colspan of table
    document.getElementById('footercell').setAttribute('colspan', cols.length+1);

    ajax(cols, rows, 0);      //begins main call

  } else {

    loadingFailed(sanity);

  }

}
/* window.onload ends */

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
          } else {                                                                      //this is slower then making all calls at once but gives more control booth of the order
            loadingComplete();                                                          //and spammy behaviour. maybe this kind of thing is better pre-processed in a back-end that can also filter absusive request?
          };

        } else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 400) {
          //API RESPONDED BAD REQUEST
          loadingBadRequest(cols,rows);

        } else if (xhr.readyState === XMLHttpRequest.DONE) {
          //API IS DEAD OR OTHERWISE NOT WORKING
          loadingFailed();
        };
      };
    })(cols, rows, i);
    xhr.send();
  }


function printColumn(col, rows, rates) {

  // format rates

  var ratesout = [];
  for (var i = 0; i < rows.length; i++) {
    ratesout[i] = rates[rows[i]]; //selects by key in object and assigns to position in array;
    console.log(parseFloat(ratesout[i]));
    if (ratesout[i] === undefined || parseFloat(ratesout[i]) === 0.0) {
      ratesout[i] = "N/A";  //error if rate is either 0 or undefined
    } else {
      ratesout[i] = accounting.formatNumber(accounting.toFixed(ratesout[i], 4), 4, " ");
    };
  };

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


/* This functions animates the ... after Loading
   Launches nestled Timeouts with 350 ms delays to show and hide
*/
function loaderAnimation() {
  var dots = document.getElementsByClassName('loading-dot');
  var extradelay = 0;
  for (var i = 0; i < dots.length; i++) {
      setTimeout(function(dots, i){
        dots[i].style.visibility = "visible";
        if (i >= 2) {
          setTimeout(function(){
            var el = document.getElementsByClassName('loading-dot');
            for (var i = 0; i < el.length; i++) {
              el[i].style.visibility = "hidden";
            }
            if (document.getElementById('loading').style.display != "none") {
              loaderAnimation();
            }
          }, 350);
        }
      }, 350+extradelay, dots, i);
      extradelay += 350;
  }
}

function loadingComplete() {
  document.getElementById('loading').style.display = "none";
  document.getElementById('theTable').style.display = "table";
  document.getElementById('homelink').style.display = "block";

}


function loadingFailed(reason) {
  eraseAllChildren(document.getElementById('loading-failed'));

  if (reason != undefined) {

    document.getElementById('loading-failed').innerHTML = reason;

  } else {

    var t1 = document.createTextNode ("Ohh no! Coinbase appears to be sleeping, please ");
    var t2 = document.createTextNode ("try again");
    var t3 = document.createTextNode (".");

    var a = document.createElement("A");
    a.setAttribute('href', '.');
    a.appendChild(t2);

    document.getElementById('loading-failed').appendChild(t1);
    document.getElementById('loading-failed').appendChild(a);
    document.getElementById('loading-failed').appendChild(t3);
  };

  document.getElementById('loading').style.display = "none";
  document.getElementById('homelink').style.display = "block";
};

/* A Bad Request response should mean that we have a code that is unsupported by the API
   in the cols array. This function gets the supported currencies and shows the user any insupported codes in either cols or rows
*/
function loadingBadRequest(cols,rows) {
  eraseAllChildren(document.getElementById('loading-failed'));

  var xhr = new XMLHttpRequest(),
  method = "GET",
  url = "https://api.coinbase.com/v2/currencies";
   xhr.open(method, url, true);
   xhr.onreadystatechange = (function (cols, rows) {
     //This syntax construct is the same as for the main call to get exchange rates. Look there for explanation.
     return function() {
       if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
         var data = JSON.parse(xhr.responseText);
         var valids = data.data.map(function(item) {    //map data.data.id (currency codes) to new array
           return item.id;
         });

         var allinputs = cols.concat(rows);

         var invalids = allinputs.filter(function(item) {  //map allinputs to invalids only when allinputs not in valids. give array of non valid inputed currencies.
           if (valids.indexOf(item) === -1) {
             return true;
           }
           return false;
         }).map(function(item) {
           return item;
         });

         var errormsg = "Codes " + invalids.toString() + ": invalid or not supported. Please <a href='index.html'>go back</a>.";
         loadingFailed(errormsg);

       } else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status != 200) {
         //API IS DEAD
         loadingFailed();
       };
     };
   })(cols, rows);
   xhr.send();
};


function eraseAllChildren(node) {
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
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
