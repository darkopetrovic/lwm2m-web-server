var express = require("express"),
    router = express.Router(),
    models = require('../scripts/models'),
    async = require('async'),
    _ = require('underscore'),
    lwm2m = require('../scripts/lwm2m'),
    lwm2mid = require('../scripts/lwm2mid'),
    lwm2mServer = lwm2m.server


/**
 * Display device details
 */
router.get("/:deviceId", function(req, res){
    lwm2mServer.getDeviceById(req.params.deviceId, function(error, device){
        if(!error){

            // list of lwm2m objects in the device
            device.objects = _.sortBy(device.objects, function(o){ return parseInt(o.id)} );
            lwm2mServer.listObserversByDeviceId(device.id, function(error, subscriptions){
                // update list of observations for the helper
                lwm2m.observations = subscriptions;
                device.observations = subscriptions;

                var tasks = [];

                tasks.push(function(callback){
                    async.each(device.observations, function(obs, callback){
                        var objres = obs.resource.split('/').filter(Boolean);
                        lwm2mid.getObject(objres[0], function (err, obj) {

                            if(obj){
                                obs.object_shortname = obj.shortname;
                                obs.object_name = obj.name;
                            }

                            lwm2mid.getResource(objres[0], objres[2], function(err, res){
                                if(res){
                                    obs.resource_shortname = res.shortname;
                                } else {
                                    obs.resource_shortname = objres[2];
                                }

                                callback();
                            });
                        });
                    }, callback);
                });

                tasks.push(function(callback){
                    // populate object's resources of the device with data from database
                    async.each(device.objects, function(obj, callback){

                        lwm2mid.getObject(obj.id, function(err, o){
                            if(o){
                                obj.name = o.name;
                                obj.shortname = o.shortname;
                            }
                            async.each(obj.instances, function(instance, callback){
                                var resources = [];
                                // for each resources listed in the device object property
                                async.each(instance.resources, function(resource, callback){
                                    lwm2mid.getResource(obj.id, resource.id, function(err, data){
                                        if(data){
                                            // get resource last value
                                            var registry = lwm2mServer.getRegistry();
                                            registry.get(device.id, function(error, device){
                                                var dobjects = device.objects;
                                                var res = _.findWhere(_.findWhere(_.findWhere(dobjects, {id: obj.id})
                                                    .instances, {id: instance.id}).resources, {id: parseInt(data.id)});
                                                if(res) {
                                                    if (res.hasOwnProperty('value')) {
                                                        data.value = res.value;
                                                    } else {
                                                        data.value = null;
                                                    }
                                                }
                                                // push full resource informations
                                                resources.push(data);
                                                callback();
                                            });
                                        } else {
                                            // add only the resource number if not found in database
                                            resources.push({id: resource.id.toString()});
                                            callback();
                                        }
                                    });
                                }, function(err){
                                    var res = _.sortBy(resources, function(e){ return parseInt(e.id)} );
                                    // add back the list of resources with informations
                                    instance.resources = res;
                                    callback();
                                });
                            }, callback);
                        });

                    }, callback);
                });

                async.parallel(tasks, function () {
                    res.render('device', {
                        device: device
                    });
                });

            });
        } else {
            res.render('404');
        }
    });
});

router.post('/cud-topic', function (req, res) {
    if(req.body._id){
        var _id = req.body._id;
        delete req.body._id;
        var Observation = models.Observation;
        if(_.keys(req.body).length>1){
            Observation.findByIdAndUpdate(_id, req.body, function(err, data) {
                res.json({error: err});
            });
        } else {
            Observation.findByIdAndRemove(_id, function(err, data) {
                res.json({error: err});
            });
        }
    } else {
        delete req.body._id;
        var Observation = new models.Observation(req.body);
        Observation.save(function(err){
            res.json({error: err});
        });
    }
});

module.exports = router;