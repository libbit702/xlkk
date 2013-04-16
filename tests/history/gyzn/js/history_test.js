require.config({
    baseUrl: "../../../../xlkk/src/",
    urlArgs: "rd="+Math.random()    
});

require(["jquery", "history"], function($) {
   
    $(function($) {
        // looking for all the links and hang on the event, all references in this document
        $("a").click(function(event){            

            // keep the link in the browser history            
            history.pushState( null, null, this.href );
            
            // here can cause data loading, etc.
            var newurl;
            if(this.href.indexOf('.html') !== -1){
                newurl = this.href.replace('.html', '_part.html');
            }else{
                newurl = 'index_part.html';
            }
            $.get(newurl, function(data) {
              $('#guidance_wrap').html(data);
            });

            // do not give a default action
            /*            
            event = event || window.event;
            // prevented default event
            if ( event.preventDefault ) {
              event.preventDefault();
            } else {
              event.returnValue = false;
            }
            */
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
            var newurl;
            if(returnLocation.href.indexOf('.html') !== -1){
                newurl = returnLocation.href.replace('.html', '_part.html');
            }else{
                newurl = 'index_part.html';
            }
            $.get(newurl, function(data) {
              $('#guidance_wrap').html(data);
            });

            // just post
            //alert( "We returned to the page with a link: " + returnLocation.href );
        });
    });
});