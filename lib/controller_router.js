function ControllerRouter() {
    this._routes = {};
    this._exact = {};
    this._prefix = {};
    this._path = {};
}

ControllerRouter.prototype.registerRoute = function(route) {

    if(route['path'].endsWith("**")) {
        route['path'] = route['path'].replace("\/\*\*", "");
        this._addPrefixPath(route);
    } else if(route['path'].indexOf('{') != -1 && route['path'].indexOf("}") != -1) {
        this._addPathVariablesPath(route);
    } else {
        this._addExactPath(route);
    }


    if (!this._routes[route.path]) {
        this._routes[route.path] = route;
    }

    if(route.method) {
        this._routes[route.path][route.method] = route.handler;
    }

    var splitRoute = route.path.split('/'),
        defaultController = splitRoute.join('/');

    if (!this._routes[defaultController]) {
        this._routes[defaultController] = route;
    }

    if(route.method) {
        this._routes[defaultController][route.method] = route.handler;
    }

};

ControllerRouter.prototype._addExactPath = function(route) {
    if(!this._exact[route.path]) {
        this._exact[route.path] = {
            path: route.path
        }
    }


    if(route.method) {
        this._exact[route.path][route.method] = route.handler;
    }
};

ControllerRouter.prototype._addPrefixPath = function(route) {
    if(!this._prefix[route.path]) {
        this._prefix[route.path] = {
            path: route.path
        }
    }


    if(route.method) {
        this._prefix[route.path][route.method] = route.handler;
    }

};

ControllerRouter.prototype._addPathVariablesPath = function(route) {
    if(!this._path[route.path]) {
        this._path[route.path] = {
            path: route.path
        }
    }


    if(route.method) {
        this._path[route.path][route.method] = route.handler;
    }
};

ControllerRouter.prototype.getPathVariablesPath = function() {
    return this._path;
}


ControllerRouter.prototype.getPrefixRoutes = function() {
    return this._prefix;
};

ControllerRouter.prototype.getExactRoutes = function() {
    return this._exact;
};

ControllerRouter.prototype.getRoutes = function() {
    return this._routes;
};


ControllerRouter._instance = null;

ControllerRouter.get = function() {
    return ControllerRouter._instance ||
        (ControllerRouter._instance = new ControllerRouter());
};

module.exports = ControllerRouter;
