
@Path("/")
@GET()
function basePathFunction(request, respone) {
    return {
        statusCode: 200,
        body: {
            basePathFunction: true
        }
    }
}

module.exports = {
    basePathFunction: basePathFunction
}