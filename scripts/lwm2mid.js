var lwm2mid = require('lwm2m-id');
var _ = require('underscore');
var models = require('./models');

var reusable_resources = {};
var specific_resources = {};
var obj = lwm2mid._defs.specificResrcChar;
for (var key in obj) {
    for (var k in obj[key]) {

        if(lwm2mid._defs.uniqueRid[k]){
            reusable_resources[lwm2mid._defs.uniqueRid[k]] = obj[key][k];
            reusable_resources[lwm2mid._defs.uniqueRid[k]].shortname = k;
        } else {
            specific_resources[k] = obj[key][k];
            specific_resources[k].id = lwm2mid._defs.specificRid[key][k];
            specific_resources[k].object_id = lwm2mid._defs.oid[key];

        }
    }
}

var objects = [];
var resources = [];

process.on('dbison', function(){

/*
    var owner1 = new models.Owner();
    owner1.id = 1;
    owner1.name = "OMA LWM2M";
    owner1.save();

    var owner2 = new models.Owner();
    owner2.id = 2;
    owner2.name = "IPSO Alliance";
    owner2.save();


    _.each(lwm2mid._defs.oid, function(k, v){
        var lwobj = new models.LwObject();
        lwobj.id = k;
        lwobj.shortname = v;
        lwobj.name = "";
        lwobj.description = "";
        lwobj.owner = owner1._id;
        lwobj.save();
    });



    _.each(reusable_resources, function(k, v){

        var lwres = new models.LwResource();
        lwres.id = v;
        lwres.shortname = k.shortname;
        lwres.name = "";
        lwres.description = "";
        lwres.access= k.access;
        lwres.multiple= k.multi;
        lwres.mandatory= k.mand;
        lwres.type= k.type.charAt(0).toUpperCase() + k.type.slice(1);
        lwres.range= k.range;
        lwres.units= "";

        lwres.save(function(err){
            if(err){
                console.log(err)
            }
        });
    });
*/

/*
    var LwObject = models.LwObject;
    _.each(specific_resources, function(k, v){

        var lwres = new models.LwResource();
        lwres.id = k.id.toString();
        lwres.shortname = v;
        lwres.name = "";
        lwres.description = "";
        lwres.access= k.access;
        lwres.multiple= k.multi;
        lwres.mandatory= k.mand;
        lwres.type= k.type.charAt(0).toUpperCase() + k.type.slice(1);
        lwres.range= k.range;
        lwres.units= "";

        LwObject.findOne({id: k.object_id}, function(err, data){
            lwres.specific_object = data._id;
            lwres.save(function(err){
                if(err){
                    console.log(err)
                }
            });
        });


    });
*/

    var LwObject = models.LwObject;
    LwObject.find().lean().exec(function(err, data){
        objects = data;
        exports.objects = objects;
    });

    var LwResource = models.LwResource;
    LwResource.find({}, function(err, data){
        resources = data;
        exports.resources = resources;
    });

});

function getObject(id, callback)
{
    var LwObject = models.LwObject;
    LwObject.findOne({id: id}, function(err, obj){
        if(obj){
            callback(null, obj.toObject());
        } else {
            callback(null);
        }
    });
}

function getFullObject(id, callback)
{
    var LwObject = models.LwObject;
    var LwResource = models.LwResource;
    var object;
    LwObject.findOne({id: id}, function(err, obj){
        object = obj;
        if(!err){
            // object is found in database
            if(object){
                // get details of associated resources (reusable resource)
                object.resourceDetails = [];
                _.each(obj.resources, function(resid){
                    LwResource.findOne({id: resid}, function(err, resource){
                        object.resourceDetails.push(resource);
                    });
                });

                // get details of associated resources (specific to the object)
                LwResource.find({specific_object: obj._id}, function(err, resources){
                    _.each(resources, function(res){
                        object.resourceDetails.push(res);
                    });
                    callback(err, object);
                });
            } else {
                var object = new LwObject({id: id});
                object.resourceDetails = [];
                callback(err, object);
            }
        } else {
            callback("Error while searching object in database.");
        }
    });
}

function getResource(oid, rid, callback)
{
    var LwObject = models.LwObject;
    var LwResource = models.LwResource;

    LwObject.findOne({id: oid}, function(err, obj){
        if(obj){
            LwResource.findOne({id: rid, specific_object: obj._id}, function(err, res){
                if(res){
                    callback(null, res.toObject());
                } else {
                    LwResource.findOne({id: rid}, function(err, res){
                        if(res){
                            callback(null, res.toObject());
                        } else {
                            callback(null);
                        }
                    });
                }
            });
        } else {
            LwResource.findOne({id: rid}, function(err, res){
                if(res){
                    callback(null, res.toObject());
                } else {
                    callback(null);
                }
            });
        }
    });
}



exports.module = lwm2mid;
exports.reusable_resources = reusable_resources;
exports.getObject = getObject;
exports.getFullObject = getFullObject;
exports.getResource = getResource;