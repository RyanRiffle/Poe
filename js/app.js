var poe = {};
poe.Types = {};

// Doesn't really have a place in the other files
$(document).ready(function () {
    $('#color-pick').click(function (event) {
        event.stopImmediatePropagation();
        $('#color-pick').parent('.dropdown').addClass('open');
    });
});