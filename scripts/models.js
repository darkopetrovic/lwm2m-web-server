'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    relationship = require("mongoose-relationship"),
    DataTable = require('mongoose-datatable');


var Owner = new Schema({
    id: Number,
    name: String
});

var LwObject = new Schema({
    id: String,
    name: String,
    shortname: String,
    description: String,
    owner: {type:Schema.ObjectId, ref: 'Owner'},
    resources: [Number]
});

var access_types = ["R", "W", "RW", "E", null];
var value_types = ["Integer", "Float", "String", "Time", "Boolean", "Execute", "Opaque", "Objlnk"];
var LwResource = new Schema({
    id: String,
    name: String,
    shortname: String,
    description: String,
    access: {type: String, enum: access_types},
    multiple: Boolean,
    mandatory: Boolean,
    type: {type: String, enum: value_types},
    range: String,
    units: String,
    specific_object: {type:Schema.ObjectId, ref: 'LwObject', default: null}
});

var DeviceModel = new Schema({
    id: Number,
    name: String,
    endpoint_prefix: String,
    objects: []
});

var commands = ["read", "write", "observe", "execute", "writeAttr"];
var RegisterAction = new Schema({
    command: {type: String, enum: commands},
    oid: {type: String, default: null},
    iid: {type: String, default: null},
    rid: {type: String, default: null},
    payload: String,
    mqtt_topic: String,
    device_model: {type:Schema.ObjectId, ref: 'DeviceModel'}
});

var Observation = new Schema({
    device_id: Number,
    oid: {type: String, default: null},
    iid: {type: String, default: null},
    rid: {type: String, default: null},
    mqtt_topic: String
});

var Aggregator = new Schema({
    name: String,
    server: {
        address: String
    },
    authentification: {
        user: String,
        password: String
    }
});

function load(db) {
    DataTable.configure({ verbose: true, debug : true });
    mongoose.plugin(DataTable.init);

    module.exports.Owner = db.model('Owner', Owner);
    module.exports.LwObject = db.model('LwObject', LwObject);
    //LwObject.plugin(relationship, { relationshipPathName: 'owner' });
    module.exports.LwResource = db.model('LwResource', LwResource);
    module.exports.DeviceModel = db.model('DeviceModel', DeviceModel);
    module.exports.RegisterAction = db.model('RegisterAction', RegisterAction);
    module.exports.Observation = db.model('Observation', Observation);
}

module.exports.load = load;
module.exports.commands = commands;
module.exports.access_types = access_types;
module.exports.value_types = value_types;