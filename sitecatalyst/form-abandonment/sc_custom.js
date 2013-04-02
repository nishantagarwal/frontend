/**
*   @desc   sample code for tracking user abandonment on web forms. 
            It helps to track the field which was last accessed before user exited/dropped from the page.
*   @author Nishant Agarwal agarwal.nishant07@gmail.com
**/

// Last form field accessed by user. 
// Initializing it to 'PageView' if user abandons without accessing any form fields.
var lastAccessField = '';

// Boolean variable to check if user actually submitted form instead of dropping off.
var hasUserSubmittedForm = true;

$(function () {
    // Specify the jQuery selector for the fields to be tracked for abandonment
    $('form input').bind('click focus', function () {
        // Set lastAccessField with field name. Field name could be part 
        var fieldName = $(this).parents('.form-row').attr('class')
        lastAccessField = fieldName.replace("form-row ", "");
    });

    // Set hasUserSubmittedForm to true when user clicks on submit button. Again update the jQuery selector to select submit button on the page.
    $('form input[type="submit"]').click(function () {
        hasUserSubmittedForm = true;
    });

    // Bind event listener for page unload event
    if (window.addEventListener) {
        // For non IE browsers
        window.addEventListener("beforeunload", function (event) {
            scCloseEventHandler();
        });
    } else if (window.attachEvent) {
        // For IE6,7,8 browsers
        window.attachEvent("beforeunload", function (event) {
            scCloseEventHandler();
        });
    }
});

/**
*   @desc beforeunload event handler
**/
function scCloseEventHandler() {

    // If user submitted form, do not do anything further.
    if (hasUserSubmittedForm) {
        return;
    }

    // Get SiteCatalyst object
    var s = s_gi(s_account);
    if (s == null) {
        return;
    }

    // Set the SiteCatalyst custom event name configured in dashboard for form abandonment event. E.g. event1 or event15
    var scEvents = 'event15';

    // Set the SiteCatalyst custom variable with lastAccessField value.
    // I've configured eVar3 to track fieldName in my SiteCatalyst dashboard.
    // You can make use of any custom variable.
    s.eVar3 = lastAccessField;
    s.events = scEvents;

    // Set linkTrackVars and linkTrackEvents appropriately
    s.linkTrackVars = "events,eVar3";
    s.linkTrackEvents = scEvents;

    // Invoke SiteCatalyst Track Link method.
    s.tl("true", 'o', 'Page Exit');
}