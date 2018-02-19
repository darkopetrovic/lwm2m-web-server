var express = require("express"),
    exphbs  = require('express-handlebars'),
    bodyParser = require('body-parser');

var app = express();
var hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: require("./static/js/hbs-helpers.js").helpers
});

var router = express.Router();
var path = __dirname + '/views/';

// -------------------------------------------------------------------
var lwm2m = require('./scripts/lwm2m'),
    config = require('lwm2m-node-lib/config-mongo').server,
    dbService = require('./scripts/db')
// -------------------------------------------------------------------

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use('/static', express.static(__dirname + '/static/'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var server = require('http').createServer(app);  
var io = require('socket.io')(server);

// MongoDB initialization and models loading
dbService.init(config.deviceRegistry.host, config.deviceRegistry.db, function(){
    process.emit('dbison');
});

lwm2m.start(io);

app.use(function(req,res,next) {
    console.log("/" + req.method);
    res.locals.cUrl = req.url;
    next();
});

//app.use("/", router);
app.use(require('./controllers'));

app.use("*",function(req, res){
  res.render('404');
});

// This is not the best practice. But sometimes we got the following error:
/*
events.js:163
      throw er; // Unhandled 'error' event
      ^

Error: No reply in 247s
    at Timeout._onTimeout (/opt/lwm2m-node-lib/node_modules/coap/lib/retry_send.js:70:16)
    at ontimeout (timers.js:380:14)
    at tryOnTimeout (timers.js:244:5)
    at Timer.listOnTimeout (timers.js:214:5)
*
*
* We don't let the application crash because of this error. Not found yet why this error is throw.
* The application responds with "Client Connection Error" after 247s when doing a request though. */
process.on('uncaughtException', function (err) {
  console.log(err);
});

server.listen(3000);
