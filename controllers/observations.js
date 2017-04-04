var express = require("express"),
    router = express.Router(),
    lwm2m = require('../scripts/lwm2m'),
    lwm2mServer = lwm2m.server,
    _ = require('underscore')

router.get("/", function(req, res){
    lwm2mServer.listObservers(function(error, subscriptions){
        lwm2mServer.listDevices(function (error, deviceList) {
            _.each(subscriptions, function(e){
                e.deviceName = _.findWhere(deviceList, {id: e.deviceId}).name;
            });

            res.render('observations', {
                observations: subscriptions
            });
        });
    });
});

module.exports = router