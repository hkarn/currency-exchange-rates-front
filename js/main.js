/*
Author: Håkan Arnoldson
For Web applications at Lernia YH
*/

!function (window,document,undefined) {
//main closure
"use strict";

window.usersLastConvInput = "";
//GLOBAL variable - prevents button spam by keeping track of last input

window.onresize = function() {
  /* Resize listener that removes bootstrap classes on media query activation for nav
  Bootstrap was too much and too specific CSS to override so I used this options
  It also caused a wierd conflict in Safari only with the 3d-animation that made the menu go invisible
  when just trying to solve this by CSS overrides

  This issue also comes from starting the design without Bootstrap. Since Bootstrap is overkill
  for my intended design. But later finding that using Bootstrap was requred by the assignment specs.

  It would have been easier to simply not use bootstrap and make my own dropdown.
  I tried using a bootstrap collapsable for the button only but it does not work well inline at all when the entire nav bar isnt bootstrap.
  Doing that much modification of Bootstrap also seemed a bit overkill, since you would probably not have used it in the first place in such a scenario
  */

  menuToggle();

};


// This function runs at start and on window rezise and changes the menu from dropdown to list or vice versa. See listener above
function menuToggle() {
  if (window.getComputedStyle(document.getElementsByClassName('nav-drop-btn')[0]).getPropertyValue('display') == 'none') {
    //if media query has activated to show hide the dropdown button

    document.getElementById('contactMenu').className = "menu-list";
    document.getElementById('dropdownToggle').className = "";
  } else {
    document.getElementById('contactMenu').className = "dropdown";
    document.getElementById('dropdownToggle').className = "dropdown-menu";
  }
}


window.onload = function() {

  menuToggle();  //sets the menu classes right for display width


  /*rewrite LinkedIn links if client language is set to prefer swedish */
  if (navigator.language.substring(0, 2) == "sv") {
    var els = Array.prototype.slice.call(document.getElementsByClassName('linkedin-link'));
    els.forEach(function(el,i) {
      els[i].setAttribute('href', 'https://www.linkedin.com/in/arnoldson/sv');
    });
  }



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

    printCurrencylists(curr[0]); //$.when creates a "success" array on top of the data. The regular response is at position 0

    //move on to try to help out by setting default currencies based on geo-location from ipinfo.io
    var arrValidCurrencies = curr[0].data.map( function (item) {
      return item.id.trim();
    });

    var arrContryCurrency = codes[0].split('\n'); //[0] because $.when adds an array to track success

    var successfull = false;  //we need to keep track of if we managed to set a value of the currency coverted selectors. they need to have a inital value to prevent errors later

    for (var i = 0; i < arrContryCurrency.length; i++) {
      arrContryCurrency[i] = arrContryCurrency[i].split(',');  //creates a multi-dimensional array arrContryCurrency[pair][0=country, 1=currency]

      //check right away so we dont need to iterate again, also checks if the currency is availiable from the API and in our values
      if ((arrContryCurrency[i][0].trim() == ip[0].country.trim()) && (arrValidCurrencies.indexOf(arrContryCurrency[i][1].trim()) != -1)) {
        document.getElementById('from-currency').value = arrContryCurrency[i][1].trim();
        document.getElementById('to-currency').value = arrContryCurrency[i][1].trim();
        successfull = true;
        break; //if found we can stop this thing
      };
    };

    if (successfull === false) {
      setDefaultInitalValuesinConverter(arrValidCurrencies[0]);
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

      var firstvalidcurrency = curr.data[0].id.trim();
      setDefaultInitalValuesinConverter(firstvalidcurrency);

      loadingComplete();
    })
    .fail(function() {

      loadingFailed();

    });
  });
  /* get main data ends */


  // Get the bitcoin spot price and print in our navbar
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


  /* Initate listeners */

  document.getElementById('convert-btn').addEventListener("click", function (event) {
    event.preventDefault();
    //lock it down immediatly to preven double clickning until after error handling or ajax
    event.target.disabled = true;
    event.target.style.boxShadow = "none";
    event.target.style.transform = "translateX(2px) translateY(2px)";

    //the button is passed along to be unlocked after we have done what we want
    convertCurrency(event.target);
  });

  document.getElementById('table-btn').addEventListener("click", function (event) {
    event.preventDefault();
    var goto = 'cross-rates.html?base=';
    var seloptions = selectedToArray(document.getElementById('base-currencies')); //returns selected options as array
    goto += seloptions.join(); //array to strong
    goto += "&pair=";
    var seloptions = selectedToArray(document.getElementById('pair-currencies'));
    goto += seloptions.join();

    window.location.href = goto;

  });




}
//end window.onload


/* - FUNCTIONS - */

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
  Function convertCurrency
  This is the initaliser and error handling for the main conversion
*/
function convertCurrency(unlockme) {

  var amount = document.getElementById('from-currency-amount').value.trim();
  //remove common thousand separators
  amount = amount.replace(' ','');
  amount = amount.replace(',','');

  if (testIfIntorDec(amount)) {
    // we have something that looks like digits!
    // first return the input back to the user in our standard format.
    // this could be usefull if the user for instance used another decimal separator then . and got unexpected
    // results from our code removing the thousand seperators
    document.getElementById('from-currency-amount').value = accounting.formatNumber(accounting.toFixed(amount, decimalsCalc(amount)), decimalsCalc(amount), " ");

    //FROM->TO conversion
    convertCurrencyCalculator(amount, document.getElementById('from-currency').value, document.getElementById('to-currency').value, document.getElementById('answer-currency-amount'), unlockme);

  } else {
    //now we want to check if the user might have wanted to do a reverse convert and put something valid in the into field instead
    var amount = document.getElementById('answer-currency-amount').value.trim();
    amount = amount.replace(' ','');
    amount = amount.replace(',','');

    if (testIfIntorDec(amount)) {
      //again return the sanitized input back to its origin making sure output is correct
      document.getElementById('answer-currency-amount').value = accounting.formatNumber(accounting.toFixed(amount, decimalsCalc(amount)), decimalsCalc(amount), " ");

      //TO->FROM conversion
      convertCurrencyCalculator(amount, document.getElementById('to-currency').value, document.getElementById('from-currency').value, document.getElementById('from-currency-amount'), unlockme);

    } else {

      //We didnt find anything valid to convert. Tell the user and clear booth field.

      var elements = document.getElementsByClassName('form-in');

      for (var i = 0; i < elements.length; i++) {
        if (getComputedStyle(elements[i]).getPropertyValue("background-color") != "rgb(255, 0, 0)") { //doesnt run if already red. to not create multiple timeouts
          elements[i].style.backgroundColor = "red";
          setTimeout( function(e, o) {
            setBgColor(e, o);
          }, 2500, elements[i], null);
        };
      };
      var t = document.createTextNode("There is no valid input. Please enter a integer or decimal (using . as deceimal separator) in either the from or to currency field.");
      var p = document.createElement("P");
      p.setAttribute("class", "input-currency-error-message");
      p.appendChild(t);

      $('.input-currency-error-message').hide(); //hide already exisitng messages (only hide, dont delete. so they timer is not interruped causeing warnings)

      insertAfternojq(document.getElementById('convert-btn'), p);

      //reset invalid input to null
      document.getElementById('answer-currency-amount').value = "";
      document.getElementById('from-currency-amount').value = "";

      //either way make it expire
      setTimeout( function(e) {
        deleteMe(e); //deletes if exist
      }, 4500, p);

      //finally unlock button
      unlockme.disabled = false;
      unlockme.removeAttribute('style');

      //Ends error message on no valid input

    };
  };
};



/*
  Function convertCurrencyCalculator
  Does the actual conversion calculation and rate ajax call
*/

function convertCurrencyCalculator(amount, base, target, output, unlockme) {

  var inputcompare = accounting.formatNumber(accounting.toFixed(amount, decimalsCalc(amount)), decimalsCalc(amount), " ") + base + target + output.id;

  if (window.usersLastConvInput != inputcompare) {

    //lock input and show we are loading
    document.getElementById('answer-currency-amount').disabled = true;
    document.getElementById('from-currency-amount').disabled = true;
    document.getElementById('to-currency').disabled = true;
    document.getElementById('from-currency').disabled = true;

    var i = document.createElement("I");
    i.setAttribute("class", "fa fa-spinner fa-spin fa-3x fa-fw");
    var p = document.createElement("P");
    p.setAttribute("style", "color:orange; padding-top: 5px;");
    p.setAttribute("class", "input-currency-loading-message");
    p.appendChild(i);

    insertAfternojq(document.getElementById('convert-btn'), p);



    window.usersLastConvInput = inputcompare;

    $.getJSON("https://api.coinbase.com/v2/exchange-rates?currency=" + base)
      .done(function(data) {
        if (data.data.rates[target] != 0) { //the API is returning zero for all prices if the rates dont exist currently.
          var result = data.data.rates[target] * amount;
          output.value = accounting.formatNumber(accounting.toFixed(result, decimalsCalc(result)), decimalsCalc(result), " ");
        } else {
            output.value = "N/A"; //Prints N/A when the api gives us a rate of 0
          }
        }
        unlockme.disabled = false;
        unlockme.removeAttribute('style');
        document.getElementById('answer-currency-amount').disabled = false;
        document.getElementById('from-currency-amount').disabled = false;
        document.getElementById('to-currency').disabled = false;
        document.getElementById('from-currency').disabled = false;
        $( ".input-currency-loading-message" ).remove();

      })
      .fail(function() {
        output.value = "ERROR!";
        unlockme.disabled = false;
        unlockme.removeAttribute('style');
        document.getElementById('answer-currency-amount').disabled = false;
        document.getElementById('from-currency-amount').disabled = false;
        document.getElementById('to-currency').disabled = false;
        document.getElementById('from-currency').disabled = false;
        $( ".input-currency-loading-message" ).remove();
      });

    } else {
      //nothing changed
      unlockme.disabled = false;
      unlockme.removeAttribute('style');

      // print error messagte
      var t = document.createTextNode("Seems you already asked for this conversion. Please change something and try again.");
      var p = document.createElement("P");
      p.setAttribute("class", "input-currency-error-message");
      p.appendChild(t);

      $('.input-currency-error-message').hide(); //hide already exisitng messages (only hide, dont delete. so they timer is not interruped causeing warnings)

      insertAfternojq(document.getElementById('convert-btn'), p);

      //make it expire
      setTimeout( function(e) {
        deleteMe(e); //deletes if exist
      }, 4000, p);

    }
};


/** Smaller help functions **/

function setBgColor(el, col) {
  el.style.backgroundColor = col;
};

function eraseAllChildren(node) {
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  };
};

function testIfIntorDec(value) {
  if (/^\d*\.?\d+$/.test(value)) {
    return true;
  } else {
    return false;
  }
}

function deleteMe(el) {
  if (el != null) {
    el.parentNode.removeChild(el);
  };
};

function setDefaultInitalValuesinConverter(valid) {
  document.getElementById('from-currency').value = valid;
  document.getElementById('to-currency').value = valid;
}

function insertAfternojq(targetnode, el) {
  if (targetnode.nextSibling != null) {
  //if not last child
  targetnode.parentNode.insertBefore(el, targetnode.nextSibling);    //in parent of target -> insert p before what is after target (insertAfter does not exist in vanilla).
  } else {
  //we are at the last child and dont need insertAfter
  targetnode.parentNode.appendChild(el);                             //we are already last
  };
};

function selectedToArray(select) {
  var options = Array.prototype.slice.call(select.options); //collection -> array
  //filter and map only select options to seloptions
  var seloptions = options.filter(function (item) {
    return item.selected;
  }).map(function (item) {
    return item.value;
  });
  return seloptions;
}

function decimalsCalc(x) {
//return 2 if number is 1 or greater else return 4
  if (x < 1) {
    return 4;
  } else {
    return 2;
  }
}
//end main closure
} (this,document);
