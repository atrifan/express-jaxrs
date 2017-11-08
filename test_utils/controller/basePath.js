
@Path("/")
function BasePathController() {}

@GET()
BasePathController.prototype.getBasePath = function(request, response) {
    return {
        statusCode: 200,
        body: {
            basePath: true
        }
    }
};

module.exports = {
    BasePathController: BasePathController
}