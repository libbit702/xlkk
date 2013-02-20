require.config({
    baseUrl: ".",
    paths: {
        "lib":"http://misc.web.xunlei.com/www_v6/js/lib/",
        "common":"http://misc.web.xunlei.com/www_v6/js/"
    },
    urlArgs: "rd=v2"
});

require(["http://misc.web.xunlei.com/www_v6/js/lib/jquery-1.8.2.min.js","vip"], function(j, v) {
    console.log(v);
});