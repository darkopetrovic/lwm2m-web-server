var express = require("express"),
    router = express.Router(),
    models = require('../scripts/models'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    lwm2m = require('../scripts/lwm2m'),
    lwm2mServer = lwm2m.server

/*****************************************************************************
 * Page "Settings" > "Device Models"
 ****************************************************************************/
router.get("/", function(req, res){
    var context = {
        commands: models.commands
    };
    res.render('device_models', context);
});

router.get('/get-models', function (req, res) {
    var DeviceModel = models.DeviceModel;
    DeviceModel.dataTable(req.query, function (err, data) {
        res.json(data);
    });
});

router.post('/cud-model', function (req, res) {
    if(req.body._id){
        var _id = req.body._id;
        delete req.body._id;
        var DeviceModel = models.DeviceModel;
        if(_.keys(req.body).length>1){
            DeviceModel.findByIdAndUpdate(_id, req.body, function(err, data) {
                res.json({error: err});
            });
        } else {
            DeviceModel.findByIdAndRemove(_id, function(err, data) {
                res.json({error: err});
            });
        }
    } else {
        delete req.body._id;

        // Create new device model based on a device.
        // Copy all objects, instances and resources from the device.
        if(req.body.device_id){
            lwm2mServer.getDeviceById(req.body.device_id, function(error, device){

                // clear resources values
                _.each(device.objects, function(obj){
                    _.each(obj.instances, function(inst){
                        _.each(inst.resources, function(res){
                            res.value = null;
                        });
                    });
                });

                var DeviceModel = models.DeviceModel;
                DeviceModel.findOne({endpoint_prefix: req.body.endpoint_prefix}, function(err, device_model) {
                    if(device_model){
                        device_model.objects = device.objects;
                        device_model.save(function(err){
                            res.json({error: err});
                        });
                    } else {
                        var DeviceModel = new models.DeviceModel(req.body);
                        DeviceModel.objects = device.objects;
                        DeviceModel.save(function(err){
                            res.json({error: err});
                        });
                    }
                });

            });
        } else {
            var DeviceModel = new models.DeviceModel(req.body);
            DeviceModel.save(function(err){
                res.json({error: err});
            });
        }
    }
});

router.get('/get-actions', function (req, res) {
    var RegisterAction = models.RegisterAction;

    if( mongoose.Types.ObjectId.isValid(req.query.device_model) ){
        var options = {
            conditions: {device_model: req.query.device_model}
        };
        RegisterAction.dataTable(req.query, options, function (err, data) {
            res.json(data);
        });
    }
});

router.post('/cud-action', function (req, res) {
    if(req.body._id){
        var _id = req.body._id;
        delete req.body._id;
        var RegisterAction = models.RegisterAction;
        if(_.keys(req.body).length>1){
            RegisterAction.findByIdAndUpdate(_id, req.body, function(err, data) {
                res.json({error: err});
            });
        } else {
            RegisterAction.findByIdAndRemove(_id, function(err, data) {
                res.json({error: err});
            });
        }
    } else {
        delete req.body._id;
        var RegisterAction = new models.RegisterAction(req.body);
        RegisterAction.save(function(err){
            res.json({error: err});
        });
    }
});

module.exports = router;