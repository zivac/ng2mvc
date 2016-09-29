var express = require('express');
var fs = require('fs');
var glob = require('glob');

var app = express();
var apiRouter = express.Router();

var bodyParser = require('body-parser')
apiRouter.use(bodyParser.json());       // to support JSON-encoded bodies
apiRouter.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var listener = app.listen(8888, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});

var models = {};

//load models
glob('./app/models/*.js', {}, function(err, files) {
    if(err) throw err;
    files.forEach(function(file) {
        var exports = require(file);
        for(var name in exports) {
            models[name] = exports[name];
            apiRouter
            .get('/'+name, function(req, res) {
                models[name].find().then(function(items) {
                    res.send(items);
                }).catch(function(err) {
                    res.send(err);
                })
            })
            .get('/'+name+'/findOne', function(req, res) {
                models[name].findOne(req.query).then(function(item) {
                    res.send(item);
                }).catch(function(err) {
                    res.send(err);
                })
            })
            .post('/'+name, function(req, res) {
                var object = new models[name](req.body);
                object.save();
                res.send({success: true});
            })
            .delete('/'+name+'/:id', function(req, res) {
                var object = new models[name](req.params.id);
                object.delete();
                res.send({success: true});
            })
        }
    })

    //load controllers
    glob('./app/controllers/*.js', {}, function(err, files) {
        if(err) throw err;
        files.forEach(function(file) {
            var exports = require(file);
            for(var name in exports) {
                var controller = exports[name];
                var routeName = controller.prototype.constructor.name.replace('Controller', '');
                Object.getOwnPropertyNames(controller.prototype).forEach(function(fun) {
                    if(fun != 'constructor' && typeof controller.prototype[fun] == 'function') {
                        apiRouter.post('/'+routeName+'/'+fun, function(req, res) {
                            var params = getParamNames(controller.prototype[fun]).map(function(param) {
                                return req.body[param];
                            })
                            res.send(controller.prototype[fun].apply(null, params));
                        })
                    }
                });
            }
        })
    })

})

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('hello world');
});

app.use('/api', apiRouter);

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
var getParamNames = function(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null)
     result = [];
  return result;
}