var express = require("express"),
    router = express.Router(),
    models = require('../scripts/models'),
    mongoose = require('mongoose'),
    _ = require('underscore')


/*****************************************************************************
 * Page "Settings" > "Object DB"
 ****************************************************************************/
router.get("/", function(req, res){
    var Owner = models.Owner;
    var LwObject = models.LwObject;
    var access_types = models.access_types;
    var value_types = models.value_types;
    Owner.find({}, function(err, owners) {
        LwObject.find({}, function(err, objects) {
            res.render('objects_db', {
                owners: owners,
                accesses: access_types,
                types: value_types,
                objects: objects
            });
        });
    });
});

router.get('/get-objects', function (req, res) {
    var LwObject = models.LwObject;

    // FIXME: add the id of the owner in the request (don't want a column).
    req.query.columns.push( req.query.columns[req.query.columns.length-1] );
    req.query.columns[req.query.columns.length-1].data = "owner.id";

    LwObject.dataTable(req.query, function (err, data) {
        res.json(data);
    });
});

router.post('/cud-object', function (req, res) {
    if(req.body._id){
        var _id = req.body._id;
        delete req.body._id;
        var LwObject = models.LwObject;
        if(_.keys(req.body).length>1){
            LwObject.findByIdAndUpdate(_id, req.body, function(err, data) {
                res.json({error: err});
            });
        } else {
            LwObject.findByIdAndRemove(_id, function(err, data) {
                res.json({error: err});
            });
        }
    } else {
        delete req.body._id;
        var LwObject = new models.LwObject(req.body);
        LwObject.save(function(err){
            res.json({error: err});
        });
    }
});

router.get('/get-resources', function (req, res) {
    var LwResource = models.LwResource;
    LwResource.dataTable(req.query, function (err, data) {
        res.json(data);
    });
});

router.get('/resource/:id1/:id2?', function (req, res) {
    var LwResource = models.LwResource;
    var LwObject = models.LwObject;

    if(!req.params.id2){
        // get a reusable resource
        LwResource.findOne({id: req.params.id1}, function (err, data) {
            res.json({object: null, resource: data.toObject()});
        });
    } else {
        // get resource associated to an object
        LwObject.findOne({id: req.params.id1}, function (err, obj) {
            if(obj){
                LwResource.findOne({id: req.params.id2, specific_object: obj._id}, function (err, data) {
                    if(!err){
                        if(data){
                            res.json({object: obj.toObject(), resource: data.toObject()});
                        } else {
                            LwResource.findOne({id: req.params.id2}, function (err, data) {
                                if(data){
                                    res.json({object: obj.toObject(), resource: data.toObject()});
                                } else {
                                    res.json({object: obj.toObject(), resource: {id: req.params.id2}});
                                }

                            });
                        }
                    } else {
                        res.json(err);
                    }
                });
            } else {
                LwResource.findOne({id: req.params.id2}, function (err, data) {
                    if(data){
                        res.json({object: null, resource: data.toObject()});
                    } else {
                        res.json({object: null, resource: null});
                    }


                });
            }


        });
    }

});

router.post('/cud-resource', function (req, res) {

    if(req.body.specific_object==""){
        req.body.specific_object = null;
    }

    req.body.mandatory = req.body.mandatory == "YES" ? true : false;
    req.body.multiple = req.body.multiple == "YES" ? true : false;

    if(req.body._id){
        var _id = req.body._id;
        delete req.body._id;
        var LwResource = models.LwResource;
        if(_.keys(req.body).length>1){
            LwResource.findByIdAndUpdate(_id, req.body, function(err, data) {
                res.json({error: err});
            });
        } else {
            LwResource.findByIdAndRemove(_id, function(err, data) {
                res.json({error: err});
            });
        }
    } else {
        delete req.body._id;

        var LwResource = new models.LwResource(req.body);
        LwResource.save(function(err){
            res.json({error: err});
        });
    }
});

router.post('/addtoobject', function (req, res) {
    var LwObject = models.LwObject;
    LwObject.findById(req.body.object__id, function(err, data){
        data.resources.push(req.body.resource_id);
        data.save(function(err){
            res.json({error: err});
        })
    })
});

module.exports = router;