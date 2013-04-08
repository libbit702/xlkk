require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()    
});

require(["jquery", "history"], function($, history) {
    $(function() {
        // looking for all the links and hang on the event, all references in this document
        $("a").click(function(){
            // keep the link in the browser history
            history.pushState( null, null, this.href );


            // here can cause data loading, etc.
            $('#link_show').html(this.href);

            // do not give a default action
            return false;
        });

        // hang on popstate event triggered by pressing back/forward in browser
        $( window ).bind( "popstate", function( e ) {

            // we get a normal Location object

            /*
            * Note, this is the only difference when using this library,
            * because the object document.location cannot be overriden,
            * so library the returns generated "location" object within
            * an object window.history, so get it out of "history.location".
            * For browsers supporting "history.pushState" get generated
            * object "location" with the usual "document.location".
            */
            var returnLocation = history.location || document.location;


            // here can cause data loading, etc.
            $('#link_show').html(this.href);

            // just post
            alert( "We returned to the page with a link: " + returnLocation.href );
        });
    });
});