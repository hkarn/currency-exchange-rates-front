# Currency cross-rate tables and converter site.

## Education assignment at Lernia YH.<br>Final assignment for the second coding course<br>Web application development in YHJUST16

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
  * [IPinfo](https://ipinfo.io) - This is an open geo-location API. It returns a guess of the users country, city and ISP based on IP.

#### Comments on APIs
  Coinbase uses only 2 decimal points for most currencies except Bitcoin, this really is not enough and some rates will just be 0.00. However free currency APIs especially including metals and bitcoin are very few. Actually Coinbase and Quandl were the only ones I found. But Quandl provides very raw data that really needs pre-processing back-end to be useful and that was beyond the scope of this assignment.


### Technologies required by assignment
  * Make some use Bootstrap or alternative framework.
  * Make four different ajax calls against a public API using jQuery.


### Method & report

####Design & API selection

Design based a one column mobile first design. After some elements have been made to show inline on larger screens.
I started by testing the APIs before doing any layout and style. I changed to API from Fixer to Coinbase because I wanted to include Bitcoin and Gold prices that Fixer doesn't support. Since the Coinbase API support all currencies on Fixer and more, there was no point in using Fixer. Using two APIs without merging them in a back-end to a new API would also, I think, have been rather unnecessarily complicated.


####Problem with selectors

Selectors are not easy to style good across browsers. In IE11 the default selector arrow is still shown but not in other browsers. They also have different vertical alignment in different browsers. I eventually made it ok enough across most browsers, all I have found that are left of inconsistencies are the extra arrows in IE.
Multiple selectors seem ok across browsers, but OS X has a setting to hide scrollbars that affect them too.
Multiple selectors do however not show the content on mobile browsers. It will simply say "0 selected" and the mobile browsers
will expand the selector as checkboxes in a overlapping window when clicked. Because of this we can increase the height of the box to show multiple options on larger devices only.


#### Two-page idea

I have separated the cross-rates table page to make it more accessible via bookmark. The idea is you can create a link to a table once. Then bookmark it and have easy access to a cross-table relevant to the currencies you use. By separating the page the number of requests and resources loaded when using a table bookmark directly can be reduced. For instance the cross-rate.html does not load Bootstrap, nor all the CSS and JS or make all the ajax calls for geo-location etc.


####Problem with API

There seems to be some bugs or bad data in the Coinbase API for seldom used currencies. In particular the gold price which seems inverted. I contacted them about the gold rate being broken and they said they have filed a bug-report but will probably not get around to fixing it anytime soon. As for the other issues it seems to come from too low precision in the API, only two decimal places are used for everything but Bitcoin that uses four.
This roughness in the API is ok for the assignment but since I want to use the cross-rates table myself later also I was thinking of doing a work around using Quandl for this until Coinbase gets it fixed. Though that will not be included in the assignment hand-in.


### Additional notes

There are various things. DOM manipulation in general that might be more efficient to do using jQuery or Bootstrap since they are already included anyway. But I didn't do it because I wanted to get more practice with vanilla JS.

<br><br>
  ![alt text](https://files.itslearning.com/data/1821/303/Lernia_logo_orange_liten.jpg "Lernia Logo")
