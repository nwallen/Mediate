FULL_BASE_URL = '/';
BASE_URL = '/';
MEDIA_URL = '/';
STATIC_URL = 'static/';
THEME_URL = 'theme/';

COLLECTION_API_URL = '/';
CAST_API_URL = '/';
USER_API_URL = '/';
FEATURES_API_URL = '/'
SEARCH_API_URL = '/';

MAP_DEFAULTS = {
    zoom: 2,
    center: [0, 0],
}

//MAP_BOUNDRY = {{boundry|safe}};

// this is set right above the close body tag. Used for UI login prompt only.
TRAVELER_USER = null;


function gettext(s) {
    return s;
}

// TODO: refactor this and facebook and current_path
// maybe find a different way to do current_path
function update_auth_redirects() {
    var next = get_next();
    $('#logout-link').attr('href', '{% url logout%}?next=' + next);
    $('#login-form input[name$="next"]').val(next);
}

function get_next() {
    return BASE_URL + '/';
}

// var templates is defined in templates.js

function translate_template(templ) {
    var list = templ.match( /gettext\('.+'\)/g );
    
    if ( list ) {
        for ( var i = 0; i < list.length; i++ ) {
            templ = templ.replace(list[i], eval(list[i]+';'));
        }
    }
    return templ;
};

//for ( i in templates ) { templates[i] = translate_template(templates[i]); }

function render_to_string(templ, context) {
    return Mustache.to_html(templates[templ], context);
}

function form_to_json(form_jq) {
    var obj = form_jq.serializeObject();
    return JSON.stringify(obj, null, 2);
}

function format_date(jq_obj, pretty) {
    var format = 'M d, yy';

    // force pretty. auto pretties anything up to a month old.
    if ( pretty ) {
        jq_obj.prettyDate(format);
    }

    else { 
        jq_obj.each(function() {
            var _this = $(this);
            var date = new Date(_this.html());
            var res = $.datepicker.formatDate(format, date);
            _this.html(res);
        });
    }
}

function mapValue(value, istart, istop, ostart, ostop) {
       return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

function is_same_day(rawstr1, rawstr2){
     var date1 = new Date((rawstr1 || "").replace(/-/g,"/").replace(/[TZ]/g," "));
     var date2 = new Date((rawstr2 || "").replace(/-/g,"/").replace(/[TZ]/g," "));

     if ( date1.getDate() == date2.getDate() &&
          date1.getMonth() == date2.getMonth() &&
          date1.getYear() == date2.getYear() ) {
        return true;
     }

    return false;
}

