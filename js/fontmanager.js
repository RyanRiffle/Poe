poe.fontManager = (function () {
    var self = {
        loadFont: function (font) {
            var font_url = "http://fonts.googleapis.com/css?family=",
                link_elm;
            font.replace(' ', '+');
            font_url = font_url + font;
            link_elm = $('<link rel="stylesheet" type="text/css" href="'+font_url+'"/>');
            $('head').append(link_elm);
        }
    };
    
    return self;
}());