var controllerRouter = require('./controller_router').get();

/**
 * The controller handler for the HTTP request.
 *
 * @name ControllerHandler
 * @constructor
 */
function ControllerHandler() {
}


ControllerHandler.prototype._match = function(request, requestPath) {
    var matchingHandler = this._matchExactPath(request, requestPath);

    if(matchingHandler) {
        return matchingHandler;
    }
    matchingHandler = this._matchWithVariables(request, requestPath);

    if(matchingHandler) {
        return matchingHandler;
    }

    matchingHandler = this._matchPrefix(request, requestPath);

    if(!matchingHandler) {
        return; //default handler
    }

    return matchingHandler;
};

ControllerHandler.prototype._matchWithVariables = function(request, requestPath) {
    var exact = controllerRouter.getPathVariablesPath();
    for(var pathValue in exact) {

        var matchPath = "^" + pathValue + "$";

        var variables = [],
            pattern;

        var parts = pathValue.split("/");
        for(var i = 0; i < parts.length; i++) {
            var part = parts[i];
            if(part.startsWith("{")) {
                variables.push(part.split("\\{").join("").split("\\}").join(""));
                parts[i] = "([^/]*)";
            }
        }
        matchPath = "^" + parts.join("/") + "$";
        pattern = new RegExp(matchPath, 'g');

        var matcher = pattern.exec(requestPath.trim());

        if(matcher) {
            var pathVars = {};
            if(variables.length > 0) {
                for(var i = 0; i < variables.length; i++) {
                    pathVars[variables[i].replace("{","").replace("}", "")] = matcher[i + 1];
                }
            } else {
                for(var i = 0; i <= matcher.length; i++) {
                    pathVars["$" + i] = matcher[i];
                }
            }

            request.pathParams = pathVars;
            return exact[pathValue];
        }
    }

    return;
}

ControllerHandler.prototype._matchExactPath = function(request, requestPath) {
    var exact = controllerRouter.getExactRoutes();

    for(var pathValue in exact) {

        var matchPath = "^" + pathValue + "$";

        var pattern;


        pattern = new RegExp(matchPath, 'g');

        var matcher = pattern.exec(requestPath.trim());

        if(matcher) {
            var pathVars = {};
            for(var i = 0; i <= matcher.length; i++) {
                pathVars["$" + i] = matcher[i];
            }

            request.pathParams = pathVars;
            return exact[pathValue];
        }
    }

    return;
}

ControllerHandler.prototype._matchPrefix = function(request, requestPath) {
    var matching = [],
        prefix = controllerRouter.getPrefixRoutes();

    var max = -1;
    for(var prefixPath in prefix) {
        var matcher = requestPath.split(prefixPath);
        if(matcher.length == 1) {
            continue;
        }

        if(!matcher[1].startsWith("/")) {
            matcher[1] = "/" + matcher[1];
        }

        var matchingLength = (prefixPath == "/" ? 0 : prefixPath.split("/").length - 1);

        matching[matchingLength] = prefixPath;
        max = Math.max(max, matchingLength);
    }

    if(max != -1) {
        var variables = {};
        variables["suffix"] = requestPath.split(matching[max]).join("");
        request.pathParams = variables;
        return prefix[matching[max]];
    }

    return null;
};

/**
 * Tryes to match the HTTP request path to the Controller Path logic and returns true or false.
 *
 * @param {String} requestPath the requestPath of the HTTP request.
 * @returns {Boolean} true/false depending on the matching logic of the HTTP request path.
 */
ControllerHandler.prototype.match = function (request) {
    var requestPath = request._parsedUrl.pathname;

    var matchingPath = this._match(request, requestPath);
    request.routerHandler = matchingPath;

    return true;
};


/**
 * The resolve handler for the HTTP request.
 *
 * @param requestPath
 */
ControllerHandler.prototype.handle = function (request, response) {
    var handler = request.routerHandler,
        method = request.method;

    if (handler && handler[method]) {
        _sendResponse(request, response, handler[method](request, response));
    } else {
        //well here is a 404
        if(!response.finished) {
            response.writeHead(404, {"Content-Type": "application/json"});
            response.end();
        }
    }
};

function _sendResponse(request, response, dataToRespond) {
    if(!dataToRespond && !response.finished) {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(JSON.stringify({}));
    } else {
        if(typeof dataToRespond.then == 'undefined') {
            //case when synchronuos response no promise here
            dataToRespond = dataToRespond || {};
            dataToRespond.headers = dataToRespond.headers || {};
            dataToRespond.headers['Content-Type'] =  dataToRespond.headers['Content-Type'] || 'application/json';
            if(!response.finished) {
                response.writeHead(dataToRespond.statusCode || 200, dataToRespond.headers || {"Content-Type": "application/json"});
                try {
                    if(dataToRespond.headers["Content-Type"] == 'application/json') {
                        response.end(dataToRespond.body ? JSON.stringify(dataToRespond.body) : "");
                    } else {
                        response.end(dataToRespond.body);
                    }
                } catch (ex) {
                    response.end(JSON.stringify({}));
                }
            }
        } else {
            //promise
            dataToRespond.then(function(data) {
                data = data || {};
                data.headers = data.headers || {};
                data.headers['Content-Type'] =  data.headers['Content-Type'] || 'application/json';

                if(!data && !response.finished) {
                    response.writeHead(200, {"Content-Type": "application/json"});
                    response.end(JSON.stringify({}));
                } else {
                    if(data) {
                        if(!response.finished) {
                            response.writeHead(data.statusCode || 200, data.headers || {"Content-Type": "application/json"});
                            try {
                                if(data.headers["Content-Type"] == 'application/json') {
                                    response.end(data.body ? JSON.stringify(data.body) : "");
                                } else {
                                    response.end(data.body);
                                }
                            } catch (ex) {
                                response.end(JSON.stringify({}));
                            }
                        }
                    }
                }
            }, function(err) {
                if(!err && !response.finished) {
                    response.writeHead(500, {"Content-Type": "application/json"});
                    response.end();
                } else {
                    if(err) {
                        if(!response.finished) {
                            response.writeHead(err.statusCode || 500, err.headers || {"Content-Type": "application/json"});
                            try {
                                response.end(err.body ? JSON.stringify(err.body) : "");
                            } catch (ex) {
                                response.end(JSON.stringify({}));
                            }
                        }
                    }
                }
            })
        }
    }
}


//TODO: to be used
function getTimeoutCallback(request, response) {
    return function () {
        if (!response.finished) {
            var component = request.component,
                viewId = request.path,
                method = request.method.toLowerCase();


            // flag the timeout for the controller
            response.timeout = true;
            // return an error response
        }
    };
}

ControllerHandler.prototype.run = function(request, response, next) {
    if(this.match(request)) {
        this.handle(request, response);
    } else {
        next();
    }
}

var _instance = null;
ControllerHandler.get = function() {
    return _instance ||
        (_instance = new ControllerHandler());
};

module.exports = ControllerHandler;