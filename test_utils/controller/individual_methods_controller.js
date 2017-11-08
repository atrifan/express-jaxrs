

@Path("/individual_1")
@GET()
function getIndividual1(request, response) {
    return {
        statusCode: 200,
        body: {
            "method": "individual1"
        }
    }
}

@Path("/individual_2")
@GET()
function getIndividual2(request, response) {
    return {
        statusCode: 200,
        body: {
            "method": "individual2"
        }
    }
}

module.exports = {
    getIndividual1: getIndividual1,
    getIndividual2: getIndividual2
}