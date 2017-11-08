var anotejs = require('annoteJS'),
    path = require('path'),
    util = require('util'),
    fs = require('fs');

anotejs.registerAnnotations('./annotations');
var anote = anotejs.get();

var controllerHandler = anote.requireWithAnnotations('./lib/controller_handler').get();

function ExpressController(){}

ExpressController.prototype.handle = function(request, response, next) {
    return controllerHandler.run(request, response, next);
};

ExpressController.prototype.setControllerRoutes = function(loadPath) {
    var anote = anotejs.get();
    var realPath = path.resolve(process.cwd(), loadPath);
    var stats = fs.statSync(realPath);
    if(!fs.existsSync(realPath) || !stats.isDirectory()) {
        throw new Exception(util.format("%s location does not exist or is not a directory", realPath));
    }

    var files = fs.readdirSync(realPath);
    files.forEach(function(val) {
        anote.requireWithAnnotations(path.resolve(realPath, val));
    })
}

module.exports = ExpressController;