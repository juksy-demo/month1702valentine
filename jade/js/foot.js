// Google Tag Manager
/*(function(w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', JUKSY.gtm_id);*/

// Init Facebook
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/zh_TW/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Configure webfont
(function(d, s) {
    var js, fjs = d.getElementsByTagName(s)[0];
    js = d.createElement(s);
    js.src = "https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js";
    js.async = 'true';
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script'));
