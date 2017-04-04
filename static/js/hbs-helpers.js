var DateFormats = {
    short: "DD.MM.YYYY HH:mm:ss",
    long: "dddd DD.MM.YYYY HH:mm"
};

var register = function(Handlebars) {

    var helpers = {
        json: function(context) { return JSON.stringify(context); },
        upperCase: function(str) {
          return str.toUpperCase();
        },
        capitalize: function(str){
            return str.toString().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
        },
        getObjName: function (id) {
            var object = _.findWhere(lwm2mid.objects, {id: id.toString()});
            if(object){
                return object.shortname;
            } else {
                return id;
            }
        },

        getResource: function (oid, rid) {

            if(oid){
                var object = _.findWhere(lwm2mid.objects, {id: oid.toString()});
                var resource = _.findWhere(lwm2mid.resources, {id: rid.toString(), specific_object: ObjectId(object._id)});
            } else {
                var resource = _.findWhere(lwm2mid.resources, {id: rid.toString()});
            }

            if(!resource){
                var resource = _.findWhere(lwm2mid.resources, {id: rid.toString()});
            }

            if(resource){
                return resource;
            } else {
                return rid;
            }
        },

        IPSO_getResName: function (oid, rid) {
            try {
                return lwm2mid.module.getRid(oid, rid).key
            }
            catch(err) {
                try {
                    return lwm2mid.module.getRid(rid).key
                } catch (err) {
                    return rid.toString();
                }
            }
        },
        IPSO_getResDef: function (oid, rid) {

            if(rid>30){
                return lwm2mid.reusable_resources[rid];
            } else {
                try {
                    return lwm2mid.module.getRdef(oid, rid);
                }
                catch(err) {
                    return lwm2mid.reusable_resources[rid];
                }
            }

        },
        parseResPath: function(path, i){
            var ele = path.split('/').filter(Boolean);
            return parseInt(ele[i]);
        },
        isObserved: function(oid, iid, rid, options){
            var respath = "/"+oid+"/"+iid+"/"+rid;
            if(lwm2m){
                if (_.findWhere(lwm2m.observations, {resource: respath})) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            } else {
                return options.inverse(this);
            }
        },

        ObjectTmplExist: function (id, options) {
            if(fs.existsSync('views/partials/'+id+'.hbs')) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        ifEqual: function (lvalue, operator, rvalue, options) {

            var operators, result;

            if (arguments.length < 3) {
                throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
            }

            if (options === undefined) {
                options = rvalue;
                rvalue = operator;
                operator = "===";
            }

            operators = {
                '==': function (l, r) { return l == r; },
                '===': function (l, r) { return l === r; },
                '!=': function (l, r) { return l != r; },
                '!==': function (l, r) { return l !== r; },
                '<': function (l, r) { return l < r; },
                '>': function (l, r) { return l > r; },
                '<=': function (l, r) { return l <= r; },
                '>=': function (l, r) { return l >= r; },
                'in': function (l, r) { return r.indexOf(l)>=0; },
                'typeof': function (l, r) { return typeof l == r; }
            };

            if (!operators[operator]) {
                throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
            }

            result = operators[operator](lvalue, rvalue);

            if (result) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }

        },
        formatDate: function (datetime, format) {
            if (moment) {
                // can use other formats like 'lll' too
                format = DateFormats[format] || format;
                return moment(datetime).format(format);
            }
            else {
                return datetime;
            }
        }
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        // register helpers
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }

};

// client
if (typeof window !== "undefined") {
    register(Handlebars);
}
// server
else {
    var lwm2mid = require('./../../scripts/lwm2mid');
    var fs = require('fs');
    var lwm2m = require('../../scripts/lwm2m');
    var moment = require('moment');
    var _ = require('underscore');
    var lwm2mServer = lwm2m.server;
    var ObjectId = require('mongoose').Schema.ObjectId;
    module.exports.register = register;
    module.exports.helpers = register(null);
}



