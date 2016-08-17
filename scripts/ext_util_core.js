/**
 *  Utility functions
 *  util_core.js was _util_frag.js
 *  These utility functions are for Homepage and Masterbrand bundles
 *  $Revision: 1.10 $
 */
if (window.cdc === undefined) {
    window.cdc = {};
}
cdc.util = {
    ensureNamespace: function (namespaceStr) {
        if (!namespaceStr) return;
        var parts = namespaceStr.split(".");
        var o = window;
        for (var i = 0; i < parts.length; i++) {
            var aPart = parts[i];
            if (typeof (o[aPart]) != "object") {
                o[aPart] = {};
            }
            o = o[aPart];
        }
    },
    checkClear: function (input, defaultPhrase) {
        if (input.value == defaultPhrase) input.value = "";
        if (input.id == "searchPhrase") {
            if (!document.getElementById("search-drop-down")) {
                setupSearch();
            }
            if (document.getElementById("search-drop-down")) {
                showSuggestionsContainer();
            }
        }
    },    // cache buster - puts a cache avoidance param on a url with a random number
    // invoke with:
    // cdc.util.cacheBust('http://www.cisco.com');          = YourUrl?cacheReset=rand#
    // cdc.util.cacheBust('http://www.cisco.com','foo');    = YourUrl?foo=rand#
    // cdc.util.cacheBust('http://ng-prod1/image');         = YourUrl&cacheReset=rand#
    // cdc.util.cacheBust('http://cisco.com/edit.pl?a=3');  = YourUrl&cacheReset=rand#
    cacheBust: function (url, param) {
        if (!param) {
            param = 'cacheReset'
        };
        var delim = "?";
        // if url is ng-prod1(bam) or has ?, set param delimeter to &
        if (url.match(/(ng-prod1|\?)/)) {
            delim = "&"
        };
        var fullParam = delim + param + '=';
        return url + fullParam + cdc.util.randomNumber();
    },
    // randum number generator
    // input: takes param limit to set random max, default is 1000
    // output: 'TimeInSeconds-RandNum'
    // invoke with: cdc.util.randomNumber(50); or cdc.util.randomNumber();
    randomNumber: function (limit) {
        if (!limit) {
            limit = 1000
        };
        var sNum = Math.floor(Math.random() * limit) + 1;
        var sTime = (new Date).getTime();
        var rNum = sTime + "-" + sNum;
        return rNum;
    },
    /* DEPRECATED - isAuthenticated() -- will often be false negative after 5/13/2012 */
    isAuthenticated: function () {
        var loggedInCookieVal = cdc.cookie.getCookie('SMSESSION');
        var userAuthStatus = null;
        if (loggedInCookieVal && loggedInCookieVal != '' && loggedInCookieVal != 'LOGGEDOFF') {
            userAuthStatus = true;
        } else {
            userAuthStatus = false;
        }
        return userAuthStatus;
    },
    /* authStatus and checkLogin replace isAuthenticated() */
    authStatus: "unready", // when ready values may be "valid", "anonymous", or "invalid"
    checkLoginQueue:[],
    checkLogin: function(callback) {
        if (typeof callback != "function") { // Client code gave us a bad parameter
            if (typeof console != "undefined" && console.trace) {
                console.log ("cdc.util.checkLogin: expecting a function, got a " + typeof callback);
                console.trace ();
            }
            return;
        }
        if (cdc.util.authStatus != "unready") {
            callback(cdc.util.authStatus);
        } else {
            cdc.util.checkLoginQueue.push (callback);
        }
    },
    notifyLoginQueue: function(val) {
    if (cdc.util.authStatus == "unready") {
        for ( i=0; i<cdc.util.checkLoginQueue.length; i++ ) {
            cdc.util.checkLoginQueue[i](val);
        }
    }
    cdc.util.authStatus = val;
    },
    openCdcPopup: function (url, width, height) {
        if (!url) {
            return true;
        } //where url is not supplied do nothing
        var windowControls = '';
        var windowOptions = '';
        var windowName = 'globalCDCpopup';

        if (typeof (url) == "object") {
            // create temp variables to function params map
            width = url.width;
            height = url.height;
            xtop = typeof (url.top) != "undefined" ? url.top : ''; //named "xtop" because "top" kills IE
            left = typeof (url.left) != "undefined" ? url.left : '';
            windowOptions = "top=" + xtop + ",left=" + left + ",";
            if (typeof (url.windowName) != "undefined") {
                windowName = url.windowName;
            };

            if (url.controls != false) { //undefined = true
                if (typeof (url.location) != "undefined" && url.location == "no") {
                    var windowControls = ",toolbar=yes,location=no,menubar=yes";
                } else {
                    var windowControls = ",toolbar=yes,location=yes,menubar=yes";
                }
            }
            url = url.address; // doing this last because it nukes the url object
        }

        width = isNaN(parseInt(width)) ? 550 : parseInt(width);
        height = isNaN(parseInt(height)) ? 550 : parseInt(height);

        /* ie scrollbar behaviour adjustment */
        if (document.all) {
            width = width + 20;
        }

        windowOptions += "width=" + width + ",height=" + height + ",status=yes,scrollbars=yes,resizable=yes" + windowControls;
        var popup = window.open(url, windowName, windowOptions);
        if (popup) popup.focus();
        return false;
    },
    /*
     * Grabs a parameter from the URL.  Returns an empty
     * string if parameter does not exist.
    */
    getParameter: function(param, url) {
        var qs;
        if(url){
            qs=url.slice(url.indexOf('?') + 1)
        }
        qs = (qs) ? qs : window.location.search;
        var val = "";
        var start = qs.indexOf(param);
        if (start != -1) {
            start += param.length + 1;
            var end = qs.indexOf("&", start);
            if (end == -1) {
                end = qs.length
            }
            val = qs.substring(start,end);
        }
        return val;
    },
    onElementLoadById: (function () {
        var docReady = false;
        jQuery(document).ready(function () {
            docReady = true;
        });
        // pull some tricks to see if an element is fully parsed into dom
        function doneLoading(elmt) {
            if (docReady) {
                return true;
            }
            while (elmt) {
                if (elmt.nextSibling) {
                    return true;
                }
                elmt = elmt.parentNode;
            }
            return false;
        }
        return function (id, func) {
            var el = false;
            (function () {
                el = el || document.getElementById(id);
                if (el && doneLoading(el)) {
                    func.call(el);
                } else {
                    window.setTimeout(arguments.callee, 100);
                }
            })();
        };
    })(),
    logoutdialog: {
        show: function () {

            cdc.util.ensureNamespace('cdc.local.wpx');
            if (!jQuery('#logoutmsg').length) {

                // if other values were in RB bundle, those are used, otherwise here are defaults
                cdc.local.wpx = jQuery.extend({
                    LOGOUT_MODAL_TITLE: "Log Out",
                    LOGOUT_MODAL_QUERY: "You are about to log out of Cisco.com.<br />If your task is incomplete, please click Cancel to finish or save.",
                    LOGOUT_YES_BUTTON_TEXT: "Log Out",
                    LOGOUT_NO_BUTTON_TEXT: "Cancel"
                }, cdc.local.wpx);

                cdc.util.logoutdialog.url = this.href;

                cdc.util.logoutdialog.html = '<div id="logoutmsg"><span id="lm-corner-top"><span></span></span>' + '<h4>' + cdc.local.wpx.LOGOUT_MODAL_TITLE + '</h4>' + '<div>' + cdc.local.wpx.LOGOUT_MODAL_QUERY + '</div>' + '<a class="a00v1" id="logoutbtn" href="' + cdc.util.logoutdialog.url + '">' + cdc.local.wpx.LOGOUT_YES_BUTTON_TEXT + '</a>' + '<a id="logoutclose" class="a00v1" href="javascript:return false">' + cdc.local.wpx.LOGOUT_NO_BUTTON_TEXT + '</a>' + '<span id="lm-corner-bot"><span></span></span></div>';

                jQuery(this).append(cdc.util.logoutdialog.html);
            //  jQuery('.ft-logout a').append(cdc.util.logoutdialog.html); -- Only line that was different between home & not home version
                jQuery('#logoutmsg').jqm({
                    modal: true,
                    toTop: true
                }).jqmAddClose('#logoutmsg #logoutclose');
            }
            jQuery('#logoutmsg').css('left', jQuery('#fw-banner').offset().left + 240);
            jQuery('#logoutmsg').jqmShow();
            setTimeout(function(){jQuery("#logoutbtn").focus()},0);// set to focus on logout button

            // when focus on cancel button and press on tab key
            jQuery("#logoutclose").keydown(function(objEvent){
                if(objEvent.keyCode == 9 ){//tab pressed
                jQuery("#logoutbtn").focus(); // focus on logout button
                objEvent.preventDefault(); // prevent the default action
                }
            });

            // when focus on logout button and press on shift+tab keys
            jQuery("#logoutbtn").keydown(function(objEvent){
                if (objEvent.keyCode == 9 && objEvent.shiftKey == 1) // checking for shif+tab key pressed(backward focus).
                {
                    jQuery("#logoutclose").focus(); // focus on cancel button
                    objEvent.preventDefault(); // prevent the default action
                }

            });

            return false;
        }
    },

        /* Local storage function wrappers */
    ls: {
        setConfigInfo: function (storeName, configObj) {
            try {
                localStorage[storeName] = JSON.stringify(configObj);
                return true;
            } catch (e) {
                return false;
            }
        },
        getConfigInfo: function (storeName) {
            try {
                return JSON.parse(localStorage[storeName]);
            } catch (e) {
                return false;
            }
        },
        deleteConfigInfo: function (storeName) {
            try {
                localStorage.removeItem(storeName);
                return true;
            } catch (e) {
                return false;
            }
        }
    },
    /* ut specific API wrapper used in UT code, does it belong here or in livemanager.js? */
    ut: {
        setConfigInfo: function (configObj) {
            cdc.util.ls.setConfigInfo("utConfig", configObj);
        },
        getConfigInfo: function () {
            var config = cdc.util.ls.getConfigInfo("utConfig");
            var now = new Date();
            if (config && config.expiry < now.getTime()) {
                if (console) {
                    console.log("Deleting expired utConfig.  Values were:" + JSON.stringify(config) + "You must resave them if you need them.");
                }
                cdc.util.ut.deleteConfigInfo();
                config = false;
            }
            return config;
        },
        deleteConfigInfo: function () {
            cdc.util.ls.deleteConfigInfo("utConfig");
        }
    },
    /* Localization function wrappers */
    locale: {
        languageforTheatercode: {
            "ES" : "es_ES",
            "DE" : "de_DE",
            "FR" : "fr_FR",
            "PL" : "pl_PL",
            "BR" : "pt_BR",
            "RU" : "ru_RU",
            "JP" : "ja_JP",
            "KR" : "ko_KR",
            "CN" : "zh_CN",
            "CZ" : "cs_CZ",
            "IT" : "it_IT",
            "TH" : "th_TH",
            "TR" : "tr_TR",
            "VN" : "vi_VN",
            "LA" : "es_LA"
        },

        theatercodeforLanguage: {
            "es" : "es_ES",
            "de" : "de_DE",
            "fr" : "fr_CA",
            "vi" : "vi_VN",
            "pl" : "pl_PL",
            "pt" : "pt_BR",
            "ru" : "ru_RU",
            "ja" : "ja_JP",
            "ko" : "ko_KR",
            "zh" : "zh_CN",
            "cs" : "cs_CZ",
            "it" : "it_IT",
            "th" : "th_TH",
            "tr" : "tr_TR",
            "en" : "en_US"
        },
        /* CK:
         * Modification:
         * Also adds isCdc functionality to indicate if link is a Cisco.com recognized link.
         * Returns
            'isCdc':isCdc, // true | false
            'getLanguage':languageCode,  // en | false
            'getCountry':theaterCode, // CA | false
            'getLocale':languageCode+'_'+theaterCode, // en_CA | false
            'matchCountry':matchCountry,  // url | meta - future to include storage | browser, etc.
            'matchLanguage':matchLanguage // url | meta - future to include storage | browser, etc.
        */
        getLocale: function( url ){
            var langArr, languageCode, theaterCode, matchLanguage, matchCountry = "";
            if (!url || url == null || url == undefined) {
                if(document.referrer){
                url=document.referrer.toString();
                }
            }

            // CK: need to break these out into their own functions so that they are accessible to other scripts to run test off of.
            var isLocalStorage = cdc.util.ls.getConfigInfo("localeinfo"); // checking for localstorage
            //http://tools.cisco.com/getlocale/index.html?loginlocale=de_DE&filterId=1&type=all
            var isParameterLoginLocale = cdc.util.getParameter('loginlocale',url); // Checking for parameter loginlocale
            //http://tools.cisco.com/getlocale/index.html?loginlocale=de_DE&filterId=1&type=all
            var isParameterLocale = cdc.util.getParameter('locale',url); // Checking for Parameter locale
            //http://tools.cisco.com/search/JSP/search-results.get?strQueryText=routers&Search+All+cisco.com=cisco.com&language=en&country=US&thissection=f&accessLevel=Guest
            var isParameterCountry = cdc.util.getParameter('country',url.toLowerCase());
            var isParameterLanguage = cdc.util.getParameter('language',url.toLowerCase());
            // http://www.cisco.com/web/CH/fr/products/index.html
            var isLanguagePattern = url.match(/(\/web\/.*[A-Z]{2,3}\/[a-z]{2}\/)/g); //tweaked to max at 3
            // http://www.cisco.com/cisco/web/CA/support/index_fr.html
            var isTheaterFilePattern = url.match(/(\/web\/[A-Z]{2,3}\/.*\_[a-z]{2}[\.\/])/g); // tweaked to max 3, add / as possible end
            // http://www.cisco.com/web/CA/products/index.html
            var isTheaterPattern = url.match(/(\/web\/.*[A-Z]{2,3}\/)/g); //tweaked to max 3
            // http://www.cisco.com/web/siteassets/legal/global/privacy_statement_ca_fr.html
            var is1xTheaterFilePattern = url.match(/(\/web\/.*\/global\/.*\_[a-z]{2,3}[\.\/])/g); // add for old privacy_statement_br.html and  privacy_statement_ca_fr.html pattern match
            // http://www.cisco.com/web/siteassets/legal/terms_condition_fr.html
            var is1xLanguageFilePattern = url.match(/(\/web\/.*\_[a-z]{2,2}[\.\/])/g); // add for old terms_condition_fr.html pattern match
            // http://www.cisco.com/en/US/hmpgs/index.html
            var is1xUsaPattern = url.match(/(\/en\/US\/)/g); // new for en/US matches


              // step 1 : Check for Local Storage...
            if(isLocalStorage){
                langArr       = isLocalStorage.toString().split('_');
                languageCode  = langArr[0];
                theaterCode   = langArr[1];
                matchLanguage = "localstorage";
                matchCountry  = "localstorage";
            }else if( (isParameterLoginLocale!="") || (isParameterLocale!="") || (isParameterLanguage != "") || (isParameterCountry != "")){
                // step 2 : Check for Parameters ...
                //http://tools.cisco.com/getlocale/index.html?loginlocale=de_DE&filterId=1&type=all
                //http://tools.cisco.com/search/JSP/search-results.get?strQueryText=routers&Search+All+cisco.com=cisco.com&language=ja&country=JP&thissection=f&accessLevel=Guest
                if(isParameterLoginLocale || isParameterLocale){
                    langArr = isParameterLoginLocale.toString().split('_');
                    if(langArr==""){langArr = isParameterLocale.toString().split('_');}
                    languageCode  = langArr[0];
                    theaterCode   = langArr[1];
                }
                else if(isParameterLanguage && isParameterCountry){
                    languageCode = isParameterLanguage;
                    theaterCode  = isParameterCountry.toUpperCase();
                }
                matchLanguage = "parameter";
                matchCountry  = "parameter";
            }else if(isLanguagePattern || isTheaterFilePattern || isTheaterPattern || is1xTheaterFilePattern || is1xLanguageFilePattern || is1xUsaPattern){
                // step 3 : Check for URL Patterns  ...
                if (isLanguagePattern){
                    langArr = isLanguagePattern.toString().split('/');
                    languageCode = langArr[langArr.length - 2];
                    theaterCode = langArr[langArr.length - 3];
                    matchLanguage = "url";
                    matchCountry  = "url";
                }else if (isTheaterFilePattern){
                    langArr = isTheaterFilePattern.toString().split('_');
                    languageCode = langArr[langArr.length - 1].replace(/[./]/g,''); // tweaked
                    theaterArr = isTheaterFilePattern.toString().split('/');
                    theaterCode = theaterArr[2];
                    matchLanguage = "url";
                    matchCountry  = "url";
                }else if (isTheaterPattern){
                    theaterArr = isTheaterPattern.toString().split('/');
                    theaterCode = theaterArr[theaterArr.length - 2];
                    languageCode = false;
                    // need to add the condition to veriy local  patterns ?????
                    if( theaterCode in cdc.util.locale.languageforTheatercode) {
                        languageCode =  (cdc.util.locale.languageforTheatercode[theaterCode]).toString().split('_')[0];
                        matchLanguage = "url";
                        matchCountry  = "url";
                    }
                }else if (is1xTheaterFilePattern){ // added
                  langArr = is1xTheaterFilePattern.toString().split('_');
                  if (langArr.length > 3) {
                      languageCode = langArr[langArr.length - 1].replace(/[./]/g,'');
                      theaterCode = langArr[langArr.length - 2].toUpperCase();
                      matchCountry ="url";
                      matchLanguage="url";
                  } else {
                    theaterCode = langArr[langArr.length - 1].replace(/[./]/g,'').toUpperCase();
                      languageCode = false;
                      matchLanguage = false;
                      matchCountry ="url";
                  }
                }else if (is1xLanguageFilePattern){ // added
                  theaterCode = false;
                  matchCountry = false;
                  matchLanguage = "url";
                  langArr = is1xLanguageFilePattern.toString().split('_');
                  languageCode = langArr[langArr.length - 1].replace(/[./]/g,'');
                  // need to add the condition to verify theatre code patterns  for all  ?????
                  if( languageCode in cdc.util.theatercodeforLanguage) {
                  theaterCode =  (cdc.util.theatercodeforLanguage[languageCode]).toString().split('_')[1];
                }
                }else if (is1xUsaPattern){ // ck: added for identifying en/US
                  langArr = is1xUsaPattern.toString().split('/');
                  languageCode = langArr[1];
                  theaterArr = is1xUsaPattern.toString().split('/');
                  theaterCode = theaterArr[2];
                   matchLanguage = "url";
                  matchCountry  = "url";
                }
            }else if(window.navigator.language){
                // step 4 : Check for Browser Settings...
                langArr = (window.navigator.language).toString().split('-');
                languageCode  = langArr[0];
                theaterCode   = langArr[1];
                if(theaterCode){theaterCode=theaterCode.toUpperCase();}
                if( languageCode in cdc.util.locale.theatercodeforLanguage && theaterCode == undefined) {
                    theaterCode =  (cdc.util.locale.theatercodeforLanguage[languageCode]).toString().split('_')[1];
                }
                matchLanguage = "Browser";
                matchCountry  = "Browser";
            }else if (url == location.href && (!theaterCode || !languageCode)){
                // step 5 : Check for Meta Data on the current Page..
                if ((theaterCode && !languageCode) || (!theaterCode && languageCode)) {
                    var getMeta = document.getElementsByTagName('meta');
                    for(var i in getMeta){
                        if(getMeta[i].name == "language" && !languageCode){
                            theaterCode = getMeta[i].content;
                            matchLanguage = "meta";
                        }
                        if(getMeta[i].name == "country" && !theaterCode){
                            theaterCode = getMeta[i].content;
                            matchCountry = "meta";
                        }
                    }
                }
            }else{  //  NOT FOUND
                languageCode  = false
                theaterCode   = false
                matchLanguage = false;
                matchCountry  = false;
            }
            // Can be rolled out into own function, if required.
            //var isCdc = (url.match(/(http)s?(:\/\/).*(cisco.com)/g)) ? true: false; // added to identify Cdc link patterns
            //if (debug) console.log ('GETLOCALE: isCdc:'+isCdc+', getLanguage:'+languageCode+', getCountry:'+theaterCode+', getLocale:'+languageCode+'_'+theaterCode+', matchCountry:'+matchCountry+', matchLanguage:'+matchLanguage);

            return {
                  //'isCdc'        :isCdc,         // true | false
                  'getLanguage'  :languageCode,  // en | false
                  'getCountry'   :theaterCode,   // CA | false
                  'getLocale'    :languageCode+'_'+theaterCode, // en_CA | false
                  'matchCountry' :matchCountry,  // url | meta - future to include storage | browser, etc.
                  'matchLanguage':matchLanguage  // url | meta - future to include storage | browser, etc.
            };
        }
    },
    /************* USAGE ****************
        cdc.util.event.defer.queueEvent(element, eventFn, delay)
        element, is the DOM element which is passsed as an argument to eventFn
        eventFn, is expected to be a function that takes the passed element as an argument
        delay is an optional parameter to override the default setting of 300ms, delay must be a number
    ************************************/
    event: {
        defer: (function () {
            var timer = 0,
                // Set a default trigger time
                trigger = 300,
                pendingEvents = {}; // Map: elementId -> pending eventFn
            return { // The delay values use the trigger value unless overriden
                queueEvent: function (element, eventFn, delay) {
                    if (delay && typeof (delay) === 'number') trigger = delay; // look for optional delay time override parameter
                    if (timer && element.id in pendingEvents) {
                        delete pendingEvents[element.id]; // We just got an "cancellation" event on a pending menu item
                    } else {
                        pendingEvents[element.id] = eventFn; // Not a cancellation
                    }
                    if (timer) clearTimeout(timer); // Restart the timer
                    timer = setTimeout("cdc.util.event.defer.runPendingEvents()", trigger);
                },
                runPendingEvents: function () {
                    for (var elementId in pendingEvents) { // Timer expired, run all of the pending events
                        var eventFn = pendingEvents[elementId];
                        var eventElement = document.getElementById(elementId);
                        eventFn(eventElement);
                    }
                    pendingEvents = {}; // We've dealt with all pending events, so clear the list:
                }
            }
        })()
    },
    findEnvironment: function () {
        /*** check for CAMP custom var - valid values= "dev","stage","prod" or "unknown" ***/
        if ((typeof cdc.util.customEnvironment !== 'undefined') && ((cdc.util.customEnvironment === 'dev') || (cdc.util.customEnvironment === 'stage') || (cdc.util.customEnvironment === 'prod') || (cdc.util.customEnvironment === 'unknown'))) {
            return cdc.util.customEnvironment;
        } else {
            return cdc.util.matchEnvironment(window.location.host);
        }
    },
    matchEnvironment: function (envToMatch) {
        var prodRegexes = [
            "www[0-9]*"
            , "apps"
            , "cdx"
            , "cepx-active-prod[0-9]*"
            , "wemapp-(author|publish)-(prod[0-9]|nprd)[0-9]*-[0-9]*"
            , "www-(author|test|publish)"
            , "www-(author|test|publish)-nprd"
            , "wwwin-tools"
            , "cisco-apps"
            , "grs"
            , "investor"
            , "newsroom"
            , "about"
            , "origin-software"
            , "software"
            , "sso[0-9]*"
            , "tools"
        ];
        var stageRegexes = [
            "apps-lt"
            , "apps-stage"
            , "cdx-stage"
            , "(cepx|ecmx)-(active|staging|wip)-(lt|stage)[0-9]*"
            , "fdk-author-lt"
            , "fdk-author-stage"
            , "fdk-(publish-)?lt[0-9]*"
            , "fdk-(publish-)?.?stage[0-9]*"
            , "wemapp-(author|publish)-stage[0-9]*-[0-9]*"
            , "software-lt"
            , "software-stage"
            , "sso-nprd[0-9]*"
            , "tools-lt"
            , "tools-stage"
            , "www-lt[0-9]*"
            , "www-(author-|publish-)*stage[0-9]*"
            , "wwwin-tools-(dev|stage|lt)"
        ];
        var devRegexes = [
            "apps-dev"
            , "cdx-dev"
            , "cepx-active-dev[0-9]*"
            , "ecmx-active-dev[0-9]*"
            , "fdk-(author-)?dev[0-9]*"
            , "fdk-(author-)?devint[0-9]*"
            , "wemapp-(author|publish)-(dev|devint|idev)[0-9]*-[0-9]*"
            , "software-dev"
            , "sso-idev[0-9]*"
            , "tools-dev"
            , "www-(dev|idev)[0-9]*"
            , "localhost"
        ];
        var prodStrings = new RegExp ("^(" + prodRegexes.join ("|") + ")(\\.|:|$)");
        var stageStrings = new RegExp ("^(" + stageRegexes.join ("|") + ")(\\.|:|$)");
        var devStrings = new RegExp ("^(" + devRegexes.join ("|") + ")(\\.|:|$)");
        return (function (location) {
            if (prodStrings.test (location)) {
                return "prod";
            }
            if (stageStrings.test (location)) {
                return "stage";
            }
            if (devStrings.test (location)) {
                return "dev";
            }
            return "unknown";
        }) (envToMatch);
    },
    js: {
       extendProperties: function(object) {
            for(prop in this) {
                if(this.hasOwnProperty(prop)){
                    if(prop == 'extendProperties') continue;

                    object[prop] = this[prop];
                }
            }

            return object;
        },

        //nextElementSibling as a function of the Object.
        nextElemSibling: function() {
            if(this.nextElementSibling) {
                return cdc.util.js.extendProperties(this.nextElementSibling);
            }

            var nextSibling = this.nextSibling;
            while(nextSibling && nextSibling.nodeType != 1) {
                nextSibling = nextSibling.nextSibling;
            }

            return cdc.util.js.extendProperties(nextSibling);

        },

        //previousElementSibling as a function of the Object.
        previousElemSibling: function() {
            if(this.previousElementSibling) {
                return cdc.util.js.extendProperties(this.previousElementSibling);
            }

            var prevSibling = this.previousSibling;
            while(prevSibling && prevSibling .nodeType != 1) {
                prevSibling = prevSibling.previousSibling;
            }

            return cdc.util.js.extendProperties(prevSibling);
        },

        //lastChild as a function of the Object.
        lastElemChild: function() {
            if(this.lastElementChild) {
                return cdc.util.js.extendProperties(this.lastElementChild);
            }

            var lastChild = this.lastChild;
            while(lastChild && lastChild.nodeType != 1) {
                lastChild = lastChild.previousSibling;
            }

            return cdc.util.js.extendProperties(lastChild);
        },

        removeClass: function(el, classname) {
            el.className=el.className.replace(new RegExp('(\\s|^)' + classname + '(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
        }
    }
};

// CK: should be merged with cdc.util.locale.getLocale's is1xUsaPattern
cdc.util.is1x = (window.location.href.indexOf("/en/US/") > 1);

// mingle #8408 - updated to test for multiple responsive class + bug fix
cdc.util.testResponsive = function() {
    var responsiveRegex = new RegExp('fw-res|fw-satellite');
    return document.body ? responsiveRegex.test(document.body.className) : false;
};
cdc.util.isResponsive = cdc.util.testResponsive();

// why is this here and not in its own or a different file?
cdc.mru = {
    serviceHost: "",
    serviceUrl: "/cisco/web/cdc/psa/mru?command=update&callbackFunctionName=somevalue",
    // -- Special need for server-side gzip support --^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ (Without this parameter, certain web clients will break when the content is gzipped)
    // Rant: This really should have been handled by said web client, but that client is breaking HTTP protocol. Oh well.
    timeOutMsecs: 250,
    makeMruRequest: function (anchor, args) {

        var updateUrl = cdc.mru.serviceHost + cdc.mru.serviceUrl;
        if (args) {
            updateUrl += args;
        } else if (anchor.mruExpando) {
            updateUrl += anchor.mruExpando;
        } else if (anchor.rel) {
            updateUrl += anchor.rel;
        }

        var serviceReturnUrl = anchor.href;
        var timeoutUrl = anchor.href;
        if (cdc.debug.on) {
            timeoutUrl += "?timeout";
            serviceReturnUrl += "?serviceReturn";
        }
        var loadHandler = function () {
                window.location.href = serviceReturnUrl;
            };
        cdc.mru.tempDoc = document.createElement('iframe');

        // Added to support both Masterbrand and Responsive Frameworks
        // framework-footer = masterbrand
        // fw-footer = responsive
        var footerElem = document.getElementById('framework-footer') ? document.getElementById('framework-footer') : (document.getElementById('fw-footer') ? document.getElementById('fw-footer') : null);
        if (footerElem !== null) { footerElem.appendChild(cdc.mru.tempDoc); }

        if (cdc.mru.tempDoc.attachEvent) {
            cdc.mru.tempDoc.attachEvent('onload', loadHandler);
        } else {
            cdc.mru.tempDoc.onload = loadHandler;
        }
        cdc.mru.tempDoc.src = updateUrl;
        jQuery(cdc.mru.tempDoc).hide();

        setTimeout("window.location.href='" + timeoutUrl + "'", cdc.mru.timeOutMsecs);
        return false;
    }
};

cdc.mru.timeOutMsecs = 50000;

/* logout dialog box gets shown to all platforms except IE 6, when logout clicked, if js is enabled. */
//Since we are not supporting IE6 and jQuery.browser from jQuery 1.10.2, commented below line
//if (!(jQuery.browser.msie && jQuery.browser.version < "7")) jQuery('.ft-logout a[href]').live('click', cdc.util.logoutdialog.show);


/* Framework and homepage Welcome message */
jQuery(document).ready(function(){
    if(cdc.util.authStatus=="valid")
    {
        cdc.userInfoDispatcher.getUserProfile({
            listOfDataFields: ["contactInfo"],
            callback: function(data) {
                // data is a JavaScript object containing the fields as requested
                var welcomeMsg="";
                if( data.contactInfo != null && !jQuery.isEmptyObject(data.contactInfo)){
                    if(data.contactInfo.givenname!=null && data.contactInfo.givenname)
                    {
                        welcomeMsg = data.contactInfo.givenname;
                    }
                    if(data.contactInfo.sn!=null && data.contactInfo.sn)
                    {
                        welcomeMsg = welcomeMsg + " " + data.contactInfo.sn;
                    }
                }
                if(jQuery.isEmptyObject(data.contactInfo) || (!data.contactInfo.givenname && !data.contactInfo.sn))
                {
                    welcomeMsg = "Logged In";
                }
                if(welcomeMsg)
                {
                    if(welcomeMsg!="Logged In")
                        welcomeMsg = "Welcome, " + welcomeMsg;
                   //Target homepage header tag and include welcome message else include on framework pages
                   if(jQuery("header#fw-masthead")[0])
                   {
                      jQuery("#fw-utility #actions li.fw-welcome").html(welcomeMsg);
                   }
                   else{
                      jQuery(".ft-toolbar span.ft-cq-welcome").html(welcomeMsg);
                   }
                }
            }
        });
   }
});
