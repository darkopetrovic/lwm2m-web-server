var express = require("express"),
    router = express.Router(),
    lwm2m = require('../scripts/lwm2m'),
    lwm2mServer = lwm2m.server,
    _ = require('underscore')

router.use('/device', require('./device'))
router.use('/observations', require('./observations'))
router.use('/objects-db', require('./objects_db'))
router.use('/device-models', require('./device_models'))

router.get("/", function(req, res){

    var sensors = [];
    lwm2mServer.listDevices(function (error, deviceList) {
        if (error) {

        } else {
            console.log('\nDevice list:\n----------------------------\n');

            for (var i=0; i < deviceList.length; i++) {
                //console.log('-> Device Id "%s"', deviceList[i].id);
                //console.log('\n%s\n', JSON.stringify(deviceList[i], null, 4));

                // get battery level
                var battery_level = _.findWhere(_.findWhere(_.findWhere(deviceList[i].objects, {id: 3})
                    .instances, {id: 0}).resources, {id: 9});

                sensors.push({
                    id: deviceList[i].id,
                    name: deviceList[i].name,
                    address: deviceList[i].address,
                    port: deviceList[i].port,
                    lifetime: deviceList[i].lifetime,
                    binding: deviceList[i].binding,
                    lastSeen: deviceList[i].lastSeen,
                    creationDate: deviceList[i].creationDate,
                    battery_level: battery_level ? battery_level.value : undefined
                });
            }
        }
    });

    context = {
        sensors: sensors
    };
    res.render('home', context);
});

module.exports = router
