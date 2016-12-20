/* 
Author: Håkan Arnoldson
For Webaplications 1 at Lernia YH
*/

!function (window,document,undefined) {
//main enclosure
"use strict";

var first = getUrlVars()["base"];
var second = getUrlVars()["pair"];

console.log(first);
console.log(second);



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
  } (this,document)
