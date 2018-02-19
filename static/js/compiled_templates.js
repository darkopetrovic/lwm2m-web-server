this["APP"] = this["APP"] || {};
this["APP"]["Templates"] = this["APP"]["Templates"] || {};

this["APP"]["Templates"]["./views/partials/tmpl/device-card.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <!--<li>-->\n                <!--<label>Battery</label>-->\n                <!--<div class=\"content\">-->\n                    <!--<div class=\"progress\" style=\"margin-bottom: 0px;\">-->\n                        <!--<div class=\"progress-bar battery-bar\" role=\"progressbar\" id=\"bar-3-0-9\"-->\n                             <!--aria-valuenow=\""
    + alias4(((helper = (helper = helpers.battery_level || (depth0 != null ? depth0.battery_level : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"battery_level","hash":{},"data":data}) : helper)))
    + "\" aria-valuemin=\"0\"-->\n                             <!--aria-valuemax=\"100\" style=\"width: 100%;\">-->\n                            <!--"
    + alias4(((helper = (helper = helpers.battery_level || (depth0 != null ? depth0.battery_level : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"battery_level","hash":{},"data":data}) : helper)))
    + "%-->\n                        <!--</div>-->\n                    <!--</div>-->\n                <!--</div>-->\n            <!--</li>-->\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"device-card\" id=\"device-card-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"device-card-header\">\n        <div class=\"col col-xs-6\">\n            <span class=\"device-card-title\" id=\"device-name\" data-name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n        </div>\n        <div class=\"col col-xs-6 text-right\">\n            <span class=\"badge\" style=\"background-color: #c6c6c6\">"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "</span>\n        </div>\n    </div>\n    <div class=\"device-card-body device-details\">\n        <ul>\n            <div class=\"row\">\n                <div class=\"col-xs-6\" style=\"padding-right: 0px\">\n                    <li>\n                        <label>IP Address</label>\n                        <div class=\"content ipaddress\" id=\"ipaddress-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.address || (depth0 != null ? depth0.address : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"address","hash":{},"data":data}) : helper)))
    + "</div>\n                    </li>\n                </div>\n                <div class=\"col-xs-3\" style=\"padding-right: 0px\">\n                    <li>\n                        <label>Port</label>\n                        <div class=\"content port\" id=\"port-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.port || (depth0 != null ? depth0.port : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"port","hash":{},"data":data}) : helper)))
    + "</div>\n                    </li>\n                </div>\n                <div class=\"col-xs-3\" style=\"padding-left: 5px\">\n                    <li>\n                        <label>Binding</label>\n                        <div class=\"content binding-box\" id=\"binding-box-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.binding || (depth0 != null ? depth0.binding : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"binding","hash":{},"data":data}) : helper)))
    + "</div>\n                    </li>\n                </div>\n            </div>\n\n            <div class=\"row\">\n                <div class=\"col-xs-8\" style=\"padding-right: 0px\">\n                    <li>\n                        <label>Creation date</label>\n                        <div class=\"content creationdate\" id=\"creationdate-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4((helpers.formatDate || (depth0 && depth0.formatDate) || alias2).call(alias1,(depth0 != null ? depth0.creationDate : depth0),"short",{"name":"formatDate","hash":{},"data":data}))
    + "</div>\n                    </li>\n                </div>\n\n                <div class=\"col-xs-4\" style=\"padding-left: 5px\">\n                    <li>\n                        <label>Lifetime</label>\n                        <div class=\"content\">\n                            <div class=\"progress\" style=\"margin-bottom: 0px;\">\n                                <div class=\"progress-bar lifetime-bar progress-bar-success\" role=\"progressbar\"\n                                     aria-valuenow=\""
    + alias4(((helper = (helper = helpers.lifetime || (depth0 != null ? depth0.lifetime : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lifetime","hash":{},"data":data}) : helper)))
    + "\" aria-valuemin=\"0\"\n                                     aria-valuemax=\""
    + alias4(((helper = (helper = helpers.lifetime || (depth0 != null ? depth0.lifetime : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lifetime","hash":{},"data":data}) : helper)))
    + "\" style=\"width: 100%;\" id=\"lifetime-bar-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n                                    "
    + alias4(((helper = (helper = helpers.lifetime || (depth0 != null ? depth0.lifetime : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lifetime","hash":{},"data":data}) : helper)))
    + "\n                                </div>\n                            </div>\n                        </div>\n                    </li>\n                </div>\n            </div>\n\n            <div class=\"row\">\n                <div class=\"col-xs-8\" style=\"padding-right: 0px\">\n                    <li>\n                        <label>Last seen</label>\n                        <div class=\"content lastseen\" id=\"lastseen-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4((helpers.formatDate || (depth0 && depth0.formatDate) || alias2).call(alias1,(depth0 != null ? depth0.lastSeen : depth0),"short",{"name":"formatDate","hash":{},"data":data}))
    + "</div>\n                    </li>\n                </div>\n            </div>\n\n"
    + ((stack1 = (helpers.ifEqual || (depth0 && depth0.ifEqual) || alias2).call(alias1,(depth0 != null ? depth0.battery_level : depth0),">=",0,{"name":"ifEqual","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        </ul>\n    </div>\n</div>\n";
},"useData":true});

this["APP"]["Templates"]["./views/partials/tmpl/observation-row.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((helpers.capitalize || (depth0 && depth0.capitalize) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.object_shortname : depth0),{"name":"capitalize","hash":{},"data":data}));
},"3":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((helpers.parseResPath || (depth0 && depth0.parseResPath) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.resource : depth0),0,{"name":"parseResPath","hash":{},"data":data}));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "<div class=\"row observation-row\" id=\"observation-"
    + alias3((helpers.parseResPath || (depth0 && depth0.parseResPath) || alias2).call(alias1,(depth0 != null ? depth0.resource : depth0),0,{"name":"parseResPath","hash":{},"data":data}))
    + "-"
    + alias3((helpers.parseResPath || (depth0 && depth0.parseResPath) || alias2).call(alias1,(depth0 != null ? depth0.resource : depth0),1,{"name":"parseResPath","hash":{},"data":data}))
    + "-"
    + alias3((helpers.parseResPath || (depth0 && depth0.parseResPath) || alias2).call(alias1,(depth0 != null ? depth0.resource : depth0),2,{"name":"parseResPath","hash":{},"data":data}))
    + "\">\n    <div class=\"col-sm-3 resource-row-name\" style=\"padding-left: 5px;\">\n    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.object_shortname : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\n    </div>\n    <div class=\"col-sm-3 resource-row-name\">"
    + alias3(((helper = (helper = helpers.resource_shortname || (depth0 != null ? depth0.resource_shortname : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"resource_shortname","hash":{},"data":data}) : helper)))
    + "</div>\n    <div class=\"col-sm-3\"><span class=\"resource-path\">"
    + alias3(((helper = (helper = helpers.resource || (depth0 != null ? depth0.resource : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"resource","hash":{},"data":data}) : helper)))
    + "</span></div>\n    <div class=\"col-sm-3 text-right\" style=\"padding-right: 5px;\">\n        <div class=\"btn-group\">\n            <button type=\"button\" class=\"btn btn-default btn-xs\">View</button>\n            <button type=\"button\" class=\"btn btn-default btn-xs dropdown-toggle\"\n                    data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                <span class=\"caret\"></span>\n                <span class=\"sr-only\">Toggle Dropdown</span>\n            </button>\n            <ul class=\"dropdown-menu\">\n                <li><a href=\"#\" data-toggle=\"modal\" data-target=\"#modal_topic\" id=\"btn_add_topic\">Add MQTT Topic</a></li>\n                <li role=\"separator\" class=\"divider\"></li>\n                <li><a href=\"#\" class=\"lwm2m-btn\"\n                       id=\"btn-cancel-"
    + alias3((helpers.parseResPath || (depth0 && depth0.parseResPath) || alias2).call(alias1,(depth0 != null ? depth0.resource : depth0),0,{"name":"parseResPath","hash":{},"data":data}))
    + "-"
    + alias3((helpers.parseResPath || (depth0 && depth0.parseResPath) || alias2).call(alias1,(depth0 != null ? depth0.resource : depth0),1,{"name":"parseResPath","hash":{},"data":data}))
    + "-"
    + alias3((helpers.parseResPath || (depth0 && depth0.parseResPath) || alias2).call(alias1,(depth0 != null ? depth0.resource : depth0),2,{"name":"parseResPath","hash":{},"data":data}))
    + "\">Cancel</a></li>\n            </ul>\n        </div>\n    </div>\n</div>";
},"useData":true});

this["APP"]["Templates"]["./views/partials/tmpl/resource-row.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "resource-mandatory";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return ((stack1 = (helpers.ifEqual || (depth0 && depth0.ifEqual) || alias2).call(alias1,"R","in",((stack1 = (depth0 != null ? depth0.r : depth0)) != null ? stack1.access : stack1),{"name":"ifEqual","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.ifEqual || (depth0 && depth0.ifEqual) || alias2).call(alias1,"W","in",((stack1 = (depth0 != null ? depth0.r : depth0)) != null ? stack1.access : stack1),{"name":"ifEqual","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.ifEqual || (depth0 && depth0.ifEqual) || alias2).call(alias1,"E","in",((stack1 = (depth0 != null ? depth0.r : depth0)) != null ? stack1.access : stack1),{"name":"ifEqual","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <button type=\"button\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Observe\"\n                        class=\"btn btn-"
    + ((stack1 = (helpers.isObserved || (depth0 && depth0.isObserved) || alias2).call(alias1,(depth0 != null ? depth0.oid : depth0),(depth0 != null ? depth0.iid : depth0),(depth0 != null ? depth0.rid : depth0),{"name":"isObserved","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + " btn-xs lwm2m-btn-"
    + ((stack1 = (helpers.isObserved || (depth0 && depth0.isObserved) || alias2).call(alias1,(depth0 != null ? depth0.oid : depth0),(depth0 != null ? depth0.iid : depth0),(depth0 != null ? depth0.rid : depth0),{"name":"isObserved","hash":{},"fn":container.program(9, data, 0),"inverse":container.program(11, data, 0),"data":data})) != null ? stack1 : "")
    + "\"\n                data-resource=\""
    + alias4(((helper = (helper = helpers.oid || (depth0 != null ? depth0.oid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"oid","hash":{},"data":data}) : helper)))
    + "-"
    + alias4(((helper = (helper = helpers.iid || (depth0 != null ? depth0.iid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"iid","hash":{},"data":data}) : helper)))
    + "-"
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\">\n                  <span class=\"glyphicon glyphicon-eye-"
    + ((stack1 = (helpers.isObserved || (depth0 && depth0.isObserved) || alias2).call(alias1,(depth0 != null ? depth0.oid : depth0),(depth0 != null ? depth0.iid : depth0),(depth0 != null ? depth0.rid : depth0),{"name":"isObserved","hash":{},"fn":container.program(13, data, 0),"inverse":container.program(15, data, 0),"data":data})) != null ? stack1 : "")
    + "\" aria-hidden=\"true\"></span>\n                </button>\n                <button type=\"button\" class=\"btn btn-default btn-xs lwm2m-btn\"\n                id=\"btn-read-"
    + alias4(((helper = (helper = helpers.oid || (depth0 != null ? depth0.oid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"oid","hash":{},"data":data}) : helper)))
    + "-"
    + alias4(((helper = (helper = helpers.iid || (depth0 != null ? depth0.iid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"iid","hash":{},"data":data}) : helper)))
    + "-"
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\">\n                  <span class=\"glyphicon glyphicon-refresh tooltip-test\" aria-hidden=\"true\" title=\"Tooltip\"></span>\n                </button>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "warning";
},"7":function(container,depth0,helpers,partials,data) {
    return "default";
},"9":function(container,depth0,helpers,partials,data) {
    return "cancel";
},"11":function(container,depth0,helpers,partials,data) {
    return "observe";
},"13":function(container,depth0,helpers,partials,data) {
    return "close";
},"15":function(container,depth0,helpers,partials,data) {
    return "open";
},"17":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <button type=\"button\" class=\"btn btn-default btn-xs lwm2m-btn-write\"\n                   data-resource=\""
    + alias4(((helper = (helper = helpers.oid || (depth0 != null ? depth0.oid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"oid","hash":{},"data":data}) : helper)))
    + "-"
    + alias4(((helper = (helper = helpers.iid || (depth0 != null ? depth0.iid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"iid","hash":{},"data":data}) : helper)))
    + "-"
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\">\n                  <span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span>\n                </button>\n";
},"19":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <button type=\"button\" class=\"btn btn-default btn-xs lwm2m-btn\"\n                id=\"btn-execute-"
    + alias4(((helper = (helper = helpers.oid || (depth0 != null ? depth0.oid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"oid","hash":{},"data":data}) : helper)))
    + "-"
    + alias4(((helper = (helper = helpers.iid || (depth0 != null ? depth0.iid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"iid","hash":{},"data":data}) : helper)))
    + "-"
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\">\n                  <span class=\"glyphicon glyphicon-play\" aria-hidden=\"true\"></span>\n                </button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div style=\"margin-bottom: 5px;\" class=\"resource-row\" data-id=\""
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\">\n    <div style=\"float: left; width:45%;\" class=\"resource-row-name "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.r : depth0)) != null ? stack1.mandatory : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n        "
    + alias4(container.lambda(((stack1 = (depth0 != null ? depth0.r : depth0)) != null ? stack1.shortname : stack1), depth0))
    + " <span style=\"font-size: 7pt;\">"
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "</span></div>\n    <div style=\"float: right; width:35%;text-align: right\" class=\"resource-row-value\">\n      <div style=\"float: right;\" id=\"value-"
    + alias4(((helper = (helper = helpers.oid || (depth0 != null ? depth0.oid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"oid","hash":{},"data":data}) : helper)))
    + "-"
    + alias4(((helper = (helper = helpers.iid || (depth0 != null ? depth0.iid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"iid","hash":{},"data":data}) : helper)))
    + "-"
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "</div>\n    </div>\n    <div style=\"display: inline-block; width: 20%;\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.r : depth0)) != null ? stack1.access : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n</div>";
},"useData":true});