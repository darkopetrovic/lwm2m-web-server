/*
 * This file is for staging the database with owners, objects and resources
 */

'use strict';

var async = require('async');
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

function create_objects(){
   var owner1 = new models.Owner();

   async.series([
      function(callback) {
         owner1.id = 1;
         owner1.name = "OMA LWM2M";
         owner1.save(function(err) {
            callback();
         });
      },
      function(callback) {
         var owner2 = new models.Owner();
         owner2.id = 2;
         owner2.name = "IPSO Alliance";
         owner2.save(function(err) {
            callback();
         })
      }
   ]);

   // Create the objects
   //_.each(lwm2mid._defs.oid, function(k, v){
   async.eachOf(lwm2mid._defs.oid, function(k, v, outCb) {
      var lwobj = new models.LwObject();
      lwobj.id = k;
      lwobj.shortname = v;
      lwobj.name = "";
      lwobj.description = "";
      lwobj.owner = owner1._id;
      lwobj.save(function(err) {
            if(err){
               console.log(err);
            }
         outCb();
      });
   },
   function() {
      console.log("objects: all done");
   });

   // Create reusable resources
   //_.each(reusable_resources, function(k, v){
   async.eachOf(reusable_resources, function(k, v, outCb) {
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
      lwres.save(function(err) {
            if(err){
               console.log(err);
            }
         outCb();
      });
   },
   function() {
      console.log("resources: all done");
   });
}

function create_resources(){
   // Create specific resources and link them to an object
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
            if (!err && data) {
               lwres.specific_object = data._id;
               lwres.save(function(err){
                  if(err){
                     console.log(err)
                  }
               });
            }
      });
   });
}

function stageDB(){
   console.log("Staging Object/Resource DB");

   models.LwObject.findOne({}, function(err, obj){
       if(!obj){
          console.log("Create objects");
          create_objects();
       }
   });

   models.LwResource.findOne({}, function(err, res){
       if(!res){
          console.log("Create resources");
          create_resources();
       }
   });

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

}

module.exports.stageDB = stageDB;
