# Currency cross-rate tables and converter site.

## Education assignment at Lernia YH.<br>Final assignment for the second coding course<br>Webapplication development in YHJUST16

### by Håkan Kindström Arnoldson
  * [LinkedIn](https://www.linkedin.com/in/arnoldson)

Live at [Arnoldson.online](https://arnoldson.online/projects/currency/) or [GitHub Pages](https://hkarn.github.io/currency-exchange-rates-front/)


### Technologies
  * CSS, HTML, JS
  * Sass
  * jQuery
  * Bootstrap
  * accounting.js (Open Exchange Rates)
  * Font Awesome


### APIs used
  * [Coinbase](https://developers.coinbase.com/api/v2) - Coinbase API is mainly a merchant interface. It does however have some open calls such as proving exchange rates for many currencies as well as the current trading price of Bitcoin and Ethereum at Coinbase.
  * [IPinfo](https://ipinfo.io) - This is a open geo-location API. It returns a guess of the users country, city and ISP based on IP.

#### Comments on APIs
  Coinbase uses only 2 decimal points for most currencies except Bitcoin, this really is not enough and some rates will just be 0.00. Some data seems to be missing and set to 0.00 for that reason also. However free currency APIs especially including metals and bitcoin are very few. Actually Coinbase and Quandl were the only ones I found. But Quandl provides very raw data that really needs pre-processing back-end to be useful and that was beyond the scope of this assignment.


### Technologies required by assignment
  * Make some use Bootstrap or alternative framework.
  * Make four different ajax calls against a public API using jQuery.


### Method & report

Design based a one column mobile first design. After some elements have been made to show inline on larger screens.
I started by testing the APIs before doing any layout and style. I changed to API from Fixer to Coinbase because I wanted to
include Bitcoin and Gold prices that Fixer doesn't support. Since the Coinbase API support all currencies on Fixer and more more there was no point in using Fixer. Using two APIs without merging them in a back-end to a new API would also, I think, have been rather unnecessarily complicated.
Selectors are not easy to style good across browsers. In IE11 the default selector arrow is still shown but not in other browsers. They also have different vertical alignment in different browsers. I eventually made it ok enough across most browsers, all I have found that are left of inconsistencies are the extra arrows in IE.
Multiple selectors seem ok across browsers, but OS X has a setting to hide scrollbars that affect them too.
Multiple selectors do however not show the content on mobile browsers. It will simply say "0 selected" and the mobile browsers
will expand the selector as checkboxes in a overlapping window when clicked. Because of this we can increase the height of the box to show multiple options only on larger devices.

I have separated the cross-rates table page to make it more accessible via bookmark. The idea is you can create a link to table once
then bookmark it and have easy access to a cross-table relevant to the currencies you use. By separating the page the number of requests and resources loaded when using a table bookmark directly can be reduced. For instance the cross-rate.html does not load Bootstrap, nor all the CSS or make all the ajax calls for geo-location etc.


### Additional notes

There are various things. DOM manipulation in general that might be more efficient to do using jQuery or Bootstrap since they are already included anyway. But is not just to practice vanilla JS.

<br><br>
  ![alt text](https://files.itslearning.com/data/1821/303/Lernia_logo_orange_liten.jpg "Lernia Logo")
