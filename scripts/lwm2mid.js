var lwm2mid = require('lwm2m-id');
var _ = require('underscore');
var models = require('./models');
var lwm2mid_db = require('./lwm2mid_db');


var objects = [];
var resources = [];
process.on('dbison', function(){

   lwm2mid_db.stageDB();
   
   exports.objects = lwm2mid_db.objects;
   exports.resources = lwm2mid_db.resources;
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
//exports.reusable_resources = reusable_resources;
exports.getObject = getObject;
exports.getFullObject = getFullObject;
exports.getResource = getResource;
