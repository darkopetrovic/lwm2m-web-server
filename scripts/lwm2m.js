'use strict';

var lwm2mServer = require('../lwm2m-node-lib/lib/lwm2m-node-lib').server,
    config = require('../lwm2m-node-lib/config-mongo'),
    async = require('async'),
    events = require('events'),
    models = require('./models'),
    _ = require('underscore'),
    mqtt = require('mqtt'),
    lwm2mid = require('./lwm2mid'),
    Device = require('../lwm2m-node-lib/lib/services/model/Device'),
    mqtt_config = require('../mqtt-config').mqtt_config;


var lwm2mevents = new events.EventEmitter();
var observations = [];
var webclient = [];

var mqttclient = mqtt.connect(mqtt_config);

mqttclient.on('error', function(error) {
    console.log(error);
});

mqttclient.on('connect', function() {
    console.log("MQTT Connected.");
});

function handleResult(message) {
    return function(error) {
        if (error) {
        } else {
            console.log('\nSuccess: %s\n', message);
        }
    };
}

function handleObserveValues(value, oid, iid, rid, did) {
    console.log('\nGot new value: %s\n', value);
    _.each(webclient, function(client) {client.emit('response', {did: did, oid: oid, iid: iid, rid: rid, value: value, error: null});});

    // Store the last value of the resource in database
    var registry = lwm2mServer.getRegistry();
    registry.get(did, function(error, device){
        if(rid){
            var res = _.findWhere(_.findWhere(_.findWhere(device.objects, {id: oid})
            .instances, {id: iid}).resources, {id: rid});
            if(res){ res.value = value; }
        }
        // store the value
        registry.update(did, device, function(){});
    });

    models.Observation.find(
        {device_id: did, oid: oid.toString(), iid: iid.toString(), rid: rid.toString()}, function(err, observations){
            if(observations){
                observations.forEach(function(obs){
                    if(obs.mqtt_topic != ""){
                        lwm2mServer.getDeviceById(did, function(error, device){
                            var topic = obs.mqtt_topic.replace("{DEVICE_NAME}", device.name);
                            topic = topic.replace("{OID}", oid);
                            topic = topic.replace("{IID}", iid);
                            topic = topic.replace("{RID}", rid);
                            mqttclient.publish(topic, '{"value":'+value+'}');
                        });
                    }
                });
            }

        });
}

function resolveObjRes(endpoint, payload, cb) {

   // update the registered device with the objects in payload and mandatory resources
   var calls = [];
   var objectsList = [];

   if (payload != "") {
      var objects = payload.toString().split(',');
      _.each(objects, function (o) {
         calls.push(function(callback) {
            // TODO: handle the case where the instance is not specified in the registration payload
            var objectId = parseInt(o.match(/<\/(.*)\/(.*)>/)[1]);
            var objectInst = parseInt(o.match(/<\/(.*)\/(.*)>/)[2]);

            var mandRes = [];
            lwm2mid.getFullObject(objectId, function (err, object) {

               // add the mandatory resource associated to the object
               _.each(object.resourceDetails, function (r) {
                  if (r.mandatory) {
                        mandRes.push({id: parseInt(r.id), value: null});
                  }
               });

               var obj = _.findWhere(objectsList, {id: objectId});
               if (obj) {
                  // object already in the list, just add the new instance
                  obj.instances.push({
                        id: objectInst,
                        resources: mandRes
                  });
               } else {
                  // add the object in the list
                  objectsList.push({
                        id: objectId,
                        instances: [{
                           id: objectInst,
                           resources: mandRes
                        }]
                  });
               }

               callback(null);
            });
         });
      });
   }

   async.parallel(calls, function(err, result){
      Device.model.findOne({name: endpoint}, function(err, device){
         // device's objects may have been populated by the device model below
         //console.log(device.objects);

         var temp = []
         _.each(objectsList, function(object) {
            var res = _.findWhere(device.objects, { id: object.id });
            if(!res){
               console.log("lwm2m adding new object into device: ", object);
               temp.push(object);
            } else {
               temp.push(res);
            }
         })

         // I tried adding the objects directly to the array but this causes a problem when saving the device.
         device.objects = temp;

         device.save(function(err) {
            if(err) console.log(err);
            //console.log(device);
            cb(device);
         });
      });
   });
}

function processActions(endpoint) {
    // get list of device model to compare with the registered device
    var DeviceModel = models.DeviceModel;
    DeviceModel.find({}, function(err, device_models){
        device_models.forEach(function(device_model){
            var register_actions = [];

            // compare the device endpoint name with the prefix device model
            var regex = new RegExp("^"+device_model.endpoint_prefix+"?");
            if(endpoint.match(regex)){
                console.log("ACTION MATCH!!!");

                // copy full objects when present to the actual device (overwrite previous object list)
                if(device_model.objects){
                    Device.model.findOne({name: endpoint}, function(err, device){
                        device.objects = device_model.objects;
                        device.save();
                    });
                }

                // retrieve actions
                var RegisterAction = models.RegisterAction;
                RegisterAction.find({device_model: device_model._id}, function(err, actions){
                    actions.forEach(function(a){
                        register_actions.push(a.toObject());
                    });

                    lwm2mServer.getDeviceByName(endpoint, function(error, device){

                        _.each(register_actions, function(e){
                            //console.log(e);

                            if(e.command == "read"){
                                lwm2mServer.read(device.id, parseInt(e.oid), parseInt(e.iid), parseInt(e.rid), function (error, result) {
                                   if(!err)
                                      console.log("Action: read returned: ", result);
                                });

                            } else if (e.command == "write"){
                                lwm2mServer.write(device.id, parseInt(e.oid), parseInt(e.iid), parseInt(e.rid), e.payload, function (error, result) {
                                   if(!err)
                                      console.log("Action: write returned: ", result);
                                });
                            } else if (e.command == "execute"){
                                lwm2mServer.execute(device.id, parseInt(e.oid), parseInt(e.iid), parseInt(e.rid), e.payload, function (error, result) {
                                   if(!err)
                                      console.log("Action: execute returned: ", result);
                                });
                            } else if (e.command == "observe"){
                                lwm2mServer.observe(device.id, parseInt(e.oid), parseInt(e.iid), parseInt(e.rid),
                                    handleObserveValues, function(error) {
                                    _.each(webclient, function(client) {
                                        client.emit('observe', {
                                            did: device.id,
                                            oid: parseInt(e.oid),
                                            iid: parseInt(e.iid),
                                            rid: parseInt(e.rid),
                                            error: error
                                        });
                                    });

                                    if(e.mqtt_topic != ""){
                                        var obs = new models.Observation({
                                            device_id: device.id,
                                            oid: e.oid,
                                            iid: e.iid,
                                            rid: e.rid,
                                            mqtt_topic: e.mqtt_topic
                                        });
                                        obs.save();
                                    }

                                });
                            } else if (e.command == "writeAttr"){

                            }

                        });
                    });
                });
            }
        })
    });
}

function registrationHandler(endpoint, lifetime, version, binding, payload, callback) {
    console.log('\nDevice registration:\n----------------------------\n');
    console.log('Endpoint name: %s\nLifetime: %s\nBinding: %s\nPayload: %s', endpoint, lifetime, binding, payload);

    // finish the registration in the database with this call
    callback();

    resolveObjRes(endpoint, payload, function(device){
         _.each(webclient, function(client) {
            client.emit('new-registration', device);
         });

         // done, now process actions
         //process.nextTick(processActions.bind(null,endpoint));
         processActions(endpoint);
    });

}

function unregistrationHandler(device, callback) {
    console.log('\nDevice unregistration:\n----------------------------\n');
    console.log('Device location: %s', device);
    lwm2mServer.cleanObserversByDeviceId(device.id, function(){
        var Observation = models.Observation;
        Observation.find({device_id: device.id}).remove();
    });

    _.each(webclient, function(client) {
        client.emit('unregistration', device);
    });

    callback();
}

function updateRegistrationHandler(obj, payload, callback) {
    callback();

    console.log('\nDevice update registration:\n----------------------------\n');
    console.log('Endpoint name: %s\nLifetime: %s\nBinding: %s\nPayload: %s', obj.name, obj.lifetime, obj.binding, payload);
    resolveObjRes(obj.name, payload, function(device) {
      //lwm2mevents.emit('update-registration', obj);
      _.each(webclient, function(client) {
         client.emit('update-registration', device);
      });
    });
}

function setHandlers(serverInfo, callback) {
    lwm2mServer.setHandler(serverInfo, 'registration', registrationHandler);
    lwm2mServer.setHandler(serverInfo, 'unregistration', unregistrationHandler);
    lwm2mServer.setHandler(serverInfo, 'updateRegistration', updateRegistrationHandler);
    callback();
}

function disconnect_client(client){
   webclient = _.without(webclient, _.findWhere(webclient, {
        id: client.id
   }));
}

function startServer(io){
    io.on('connection', function(client) {
        console.log('Web client connected to the LwM2M Server: ', client.id, client.handshake.address);
        webclient.push(client);

        client.on('user', function(data) {
            console.log(data);
            if(data.action=="read"){
                lwm2mServer.read(data.did, data.oid, data.iid, data.rid, function (error, result) {
                    client.emit('response', {
                        did: data.did,
                        oid: data.oid,
                        iid: data.iid,
                        rid: data.rid,
                        value: result,
                        error: error
                    });

                    // Store the last value of the resource in database
                    var registry = lwm2mServer.getRegistry();
                    registry.get(data.did, function(error, device){
                        if(!device || error){
                            return false;
                        }

                        var o = device.objects;

                        // read the resource
                        if(data.rid){
                            var res = _.findWhere(_.findWhere(_.findWhere(o, {id: data.oid})
                            .instances, {id: data.iid}).resources, {id: data.rid});
                            if(res){ res.value = result; }
                        }

                        // read the instance
                        else if(result) {
                            /* Example of SenML string:
                             {"e":[{"n":"5701","sv":"V"},{"n":"5750","sv":"Solar panel voltage"},{"n":"5603","v":0},
                             {"n":"5604","v":4},{"n":"5601","v":0},{"n":"5602","v":1}]}
                             */

                            var senml = JSON.parse(result);
                            _.each(senml.e, function (resource) {
                                var res = _.findWhere(_.findWhere(_.findWhere(o, {id: data.oid})
                                    .instances, {id: data.iid}).resources, {id: parseInt(resource.n)});
                                if(res){ res.value = resource[Object.keys(resource)[1]]; }
                            });
                        }

                        // store the value
                        registry.update(data.did, device, function(){});
                    });

                });
            } else if (data.action=="discover"){
                lwm2mServer.discover(data.did, data.oid, data.iid, function handleDiscover(error, payload) {
                    if (!error) {
                        var resourcesPath = payload.substr(payload.indexOf(',') + 1).replace(/<|>/g, '').split(',');
                        var resources = resourcesPath.map(function(e){
                            return parseInt(e.split('/').pop());
                        });

                        client.emit('discover', {
                            oid:data.oid,
                            iid:data.iid,
                            resources:resources,
                            error: null
                        });

                        var registry = lwm2mServer.getRegistry();

                        registry.get(data.did, function(error, device){
                            var o = device.objects;
                            var dRes = _.findWhere(_.findWhere(o, {id: data.oid})
                                .instances, {id:  data.iid}).resources;
                            _.difference(resources, dRes.map(function(e){return e.id})).map(function(resid){
                                dRes.push({id: resid, value: null});
                            });
                            registry.update(data.did, device, function(error){

                            });

                        });

                    } else {
                        client.emit('discover', {
                            oid:data.oid,
                            iid:data.iid,
                            resources:null,
                            error: error
                        });
                    }
                });
            } else if (data.action=="write") {
                lwm2mServer.write(data.did, data.oid, data.iid, data.rid, data.value, function (error, result) {
                    /* Normally we don't receive a payload after a 'write' operation. Thus, if the operation
                    * succeed, the input value is returned back on the screen simulating an imediate reading
                    * operation. */
                    client.emit('response', {oid:data.oid, iid:data.iid, rid:data.rid, value: data.value, error: error});
                });
            } else if (data.action=="observe") {
                lwm2mServer.observe(data.did, data.oid, data.iid, data.rid, handleObserveValues, function handleObserve(error) {
                    console.log('\nObserver stablished over resource [/%s/%s/%s]\n', data.oid, data.iid, data.rid);
                    client.emit('observe', {did:data.did, oid:data.oid, iid:data.iid, rid:data.rid, error: error});
                });
            } else if (data.action=="cancel") {
                lwm2mServer.cancelObserver(data.did, data.oid, data.iid, data.rid, function(error) {
                    console.log('\nObserver canceled over resource [/%s/%s/%s]\n', data.oid, data.iid, data.rid);
                    client.emit('cancelObservation', {did:data.did, oid:data.oid, iid:data.iid, rid:data.rid, error: error});
                });
            } else if (data.action=="execute") {
                lwm2mServer.execute(data.did, data.oid, data.iid, data.rid, null, function (error) {
                    console.log('\nExecute on resource [/%s/%s/%s]\n', data.oid, data.iid, data.rid);
                    client.emit('execute', {oid:data.oid, iid:data.iid, rid:data.rid, error: error});
                });
            }

        });
    
        client.on('disconnect', function() {
           console.log("Client disconnected:", client.id);
           disconnect_client(client);
        });

    });


	async.waterfall([
        async.apply(lwm2mServer.start, config.server),
        setHandlers
    ], handleResult('Lightweight M2M Server started'));
}

exports.server = lwm2mServer;
exports.start = startServer;
exports.events = lwm2mevents;
exports.observations = observations;
