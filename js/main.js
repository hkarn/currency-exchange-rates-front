/* GLOBALS */

//Currencies supported Fixer
function FixerCurrencies(callback){
  $.ajax({
      url: "https://api.fixer.io/latest",
      dataType: 'json'
      })
      .done(function(data) {
          callback(Object.keys(data.rates)); //gives an array from the keynames in data.rates
      })
      .fail(function() {
          callback("error");
  });
 }


FixerCurrencies(function(data) {
  console.log("tho1");
  console.log(data);
});



  //Getting the coinbase currency list and storing in global scope.
  function CoinbaseCurrencies(callback){
    $.ajax({
        url: "https://api.coinbase.com/v2/currencies",
        dataType: 'json'
        })
        .done(function(data) {
          var newdata = data.data.map(function(x) {
            return x.id;
          });
          /*
          the map above is the same as:
          for (var i = 0; i < data.data.length; i++) {
          newdata.push(data.data[i].id);
          }*/

            callback(newdata);
        })
        .fail(function() {
            callback("error");
    });
   }
   CoinbaseCurrencies(function(data) {
     console.log("tho2");
     console.log(data);
   });






$.getJSON('https://ipinfo.io', function(data){
})
  .done(function(data) {
    console.log(data);
  })
  .fail(function(data) {
    console.log( "error" );
    console.log(data);
});




function getCrossTable(base,list) {
  /* check input */



  $.getJSON('https://api.fixer.io/latest?base=' + base + '&symbols=' + list, function(data){
    })
      .done(function(data) {
        console.log(data);
      })
      .fail(function(data) {
        console.log( "error" );
        console.log(data);
    });
};




$.getJSON('https://api.fixer.io/latest?base=USD&symbols=SEK,GBP', function(data){
  })
    .done(function(data) {
      console.log(data);
    })
    .fail(function(data) {
      console.log( "error" );
      console.log(data);
  });


console.log(window);

  $.getJSON('https://api.kraken.com/0/public/Ticker?pair=XBTEUR', function(data){
  })
    .done(function(data) {
      console.log(data);
    })
    .fail(function(data) {
      console.log( "error" );
      console.log(data);
  });

  $.getJSON('https://api.coinbase.com/v2/exchange-rates?currency=EUR', function(data){
  })
    .done(function(data) {
      console.log(data);
    })
    .fail(function(data) {
      console.log( "error" );
      console.log(data);
  });

  $.getJSON('https://api.coinbase.com/v2/exchange-rates?currency=BTC', function(data){
  })
    .done(function(data) {
      console.log(data);
    })
    .fail(function(data) {
      console.log( "error" );
      console.log(data);
  });

  $.getJSON('https://api.coinbase.com/v2/exchange-rates?currency=XAG', function(data){
  })
    .done(function(data) {
      console.log(data);
    })
    .fail(function(data) {
      console.log( "error" );
      console.log(data);
  });

  $.getJSON('https://api.coinbase.com/v2/exchange-rates?currency=XAU', function(data){
  })
    .done(function(data) {
      console.log(data);
    })
    .fail(function(data) {
      console.log( "error" );
      console.log(data);
  });

function doesCodeExist(arrValidCodes,code) {

    if (arrValidCodes === "not ready")
      return "not ready";

    var hit = arrValidCodes.filter(function(item){
        return (code === item)
    }).map(function(item){
    return true;
    });
    if (hit[0] === true) {
      return true;
    } else {
      return false;
    }
}
