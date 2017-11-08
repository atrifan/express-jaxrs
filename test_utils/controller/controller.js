var Promise = require('promised-io/promise');

@Path("/controller")
function Controller(){}

@Path("/nothing")
@GET()
Controller.prototype.noResponse = function(request, response) {
    return;
}

@Path("/{id}")
@GET()
Controller.prototype.getId = function(request, response) {
    return {
        statusCode: 200,
        body: {
            id: request.pathParams['id'],
            verb: 'get'
        }
    }
};

@Path("/123")
@GET()
Controller.prototype.getIdPersonal = function(request, response) {
    return {
        statusCode: 200,
        body: {
            id: 'myId'
        }
    }
};


@Path("/{id}")
@POST()
Controller.prototype.postId = function(request, response) {
    return {
        statusCode: 200,
        body: {
            id: request.pathParams['id'],
            verb: 'post'
        }
    }
};

@Path("/{id}")
@PUT()
Controller.prototype.putId = function(request, response) {
    return {
        statusCode: 200,
        body: {
            id: request.pathParams['id'],
            verb: 'put'
        }
    }
};


@Path("/{id}")
@DELETE()
Controller.prototype.deleteId = function(request, response) {
    return {
        statusCode: 200,
        body: {
            id: request.pathParams['id'],
            verb: 'delete'
        }
    }
};

@Path("/**")
@GET()
Controller.prototype.generic = function(request, response) {
    return {
        statusCode: 200,
        body: {
            params: request.pathParams,
            generic: true
        }
    }
};

@Path("/tommorow/**")
@GET()
Controller.prototype.genericRestricted = function(request, response) {
    return {
        statusCode: 200,
        body: {
            params: request.pathParams,
            generic: true
        }
    }
};

@Path("/query")
@GET()
Controller.prototype.queryTest = function(request, response) {
    return {
        statusCode: 200,
        body: {
            query: request.query
        }
    }
};

@Path("/promise")
@GET()
Controller.prototype.promiseTest = function(request, response) {
    var deferred = Promise.defer();

    process.nextTick(function() {
        deferred.resolve({
            statusCode: 200,
            body: {
                promise: true
            }
        })
    });
    return deferred.promise;
};

@Path("/different_content_type")
@GET()
Controller.prototype.differentContent = function(request, response) {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html'
        },
        body: 'some test'
    }
};

@Path("/no_put")
@GET()
Controller.prototype.noPut = function(request, response) {
    return {
        statusCode: 200,
        body: {
            'say': 'what'
        }
    }
};


module.exports = {
    Controller: Controller
};