var expect = require('expect.js'),
    sinon = require('sinon'),
    http = require('http'),
    Promise = require('promised-io/promise');

describe('Test routing annotations work', function() {
    var basicConfig;
    beforeEach(function() {
        basicConfig = {
            host: 'localhost',
            port: 30128,
            method : undefined
        }
    });
    describe('@Path annotations', function() {
        it('path params should work', function(done) {
            basicConfig.path = '/controller/12344';
            http.get(basicConfig, function(response) {
               var body = '';
               response.on('data', function(data) {
                   body += data;
               });
               response.on('end', function() {
                   body = JSON.parse(body);
                   expect(body.id).to.be('12344');
                   done();
               });
            });
        });
        it('exact matches work over path params', function(done) {
            basicConfig.path = '/controller/123';
            http.get(basicConfig, function(response) {
                var body = '';
                response.on('data', function(data) {
                    body += data;
                });
                response.on('end', function() {
                    body = JSON.parse(body);
                    expect(response.statusCode).to.be(200);
                    expect(body.id).to.be('myId');
                    done();
                });
            });
        });
        it('if missing return response should give 200 application/json with empty body', function(done) {
            basicConfig.path = '/controller/nothing';
            http.get(basicConfig, function(response) {
                var body = '';
                response.on('data', function(data) {
                    body += data;
                });
                response.on('end', function() {
                    expect(body).to.be('{}');
                    expect(response.statusCode).to.be(200);
                    done();
                });
            });
        });
        it('should automatically give 404 for missing path', function(done) {
            basicConfig.path = '/not_found';
            http.get(basicConfig, function(response) {
                var body = '';
                response.on('data', function(data) {
                    body += data;
                });
                response.on('end', function() {
                    expect(response.statusCode).to.be(404);
                    done();
                });
            });
        });
        it('prefix paths should work if other paths not found', function(done) {
            basicConfig.path = '/controller/tommorow/new';
            http.get(basicConfig, function(response) {
                var body = '';
                response.on('data', function(data) {
                    body += data;
                });
                response.on('end', function() {
                    body = JSON.parse(body);
                    expect(response.statusCode).to.be(200);
                    expect(body.generic).to.be(true);
                    expect(body.params.suffix).to.be('/new');
                    done();
                });
            });
        });
        it('for multiple prefix paths most suitable should be used', function(done) {
            basicConfig.path = '/controller/generic/new';
            http.get(basicConfig, function(response) {
                var body = '';
                response.on('data', function(data) {
                    body += data;
                });
                response.on('end', function() {
                    body = JSON.parse(body);
                    expect(response.statusCode).to.be(200);
                    expect(body.generic).to.be(true);
                    expect(body.params.suffix).to.be('/generic/new');
                    done();
                });
            });
        });
        it('should work for individual methods and not class', function(done) {
            var deferred = Promise.defer();
            basicConfig.path = '/individual_1';
            http.get(basicConfig, function(response) {
                var body = '';
                response.on('data', function(data) {
                    body += data;
                });
                response.on('end', function() {
                    body = JSON.parse(body);
                    expect(response.statusCode).to.be(200);
                    expect(body.method).to.be('individual1');
                    deferred.resolve();
                });
            });

            deferred.then(function() {
                basicConfig.path = '/individual_2';
                http.get(basicConfig, function(response) {
                    var body = '';
                    response.on('data', function(data) {
                        body += data;
                    });
                    response.on('end', function() {
                        body = JSON.parse(body);
                        expect(response.statusCode).to.be(200);
                        expect(body.method).to.be('individual2');
                        done();
                    });
                });
            })
        });
        it('should add base path as controller name if not set at class level', function(done) {
            basicConfig.path = '/basePath';
            http.get(basicConfig, function(response) {
                var body = '';
                response.on('data', function(data) {
                    body += data;
                });
                response.on('end', function() {
                    body = JSON.parse(body);
                    expect(response.statusCode).to.be(200);
                    expect(body.basePath).to.be(true);
                    done();
                });
            });
        });
        it('should add base path as controller name if not set at function level', function(done) {
            basicConfig.path = '/basePath_function';
            http.get(basicConfig, function(response) {
                var body = '';
                response.on('data', function(data) {
                    body += data;
                });
                response.on('end', function() {
                    body = JSON.parse(body);
                    expect(response.statusCode).to.be(200);
                    expect(body.basePathFunction).to.be(true);
                    done();
                });
            });
        });
        it('should work for query params', function(done) {
            basicConfig.path = '/controller/query?test=one';
            http.get(basicConfig, function(response) {
                var body = '';
                response.on('data', function(data) {
                    body += data;
                });
                response.on('end', function() {
                    body = JSON.parse(body);
                    expect(response.statusCode).to.be(200);
                    expect(body.query.test).to.be("one");
                    done();
                });
            });
        });
        it('should work for promises', function(done) {
            basicConfig.path = '/controller/promise';
            http.get(basicConfig, function(response) {
                var body = '';
                response.on('data', function(data) {
                    body += data;
                });
                response.on('end', function() {
                    body = JSON.parse(body);
                    expect(response.statusCode).to.be(200);
                    expect(body.promise).to.be(true);
                    done();
                });
            });
        });
        it('should work for different response content-type', function(done) {
            basicConfig.path = '/controller/different_content_type';
            http.get(basicConfig, function(response) {
                var body = '';
                response.on('data', function(data) {
                    body += data;
                });
                response.on('end', function() {
                    expect(response.statusCode).to.be(200);
                    expect(response.headers["content-type"]).to.be("text/html");
                    expect(body).to.be('some test');
                    done();
                });
            });
        });
    });
    describe('@POST @GET @PUT @DELETE annotations', function() {
        it('should work for @GET', function(done) {
            basicConfig.path = '/controller/12344';
            http.get(basicConfig, function(response) {
                var body = '';
                response.on('data', function(data) {
                    body += data;
                });
                response.on('end', function() {
                    body = JSON.parse(body);
                    expect(body.id).to.be('12344');
                    expect(body.verb).to.be('get');
                    done();
                });
            });
        });
        it('should work for @POST', function(done) {
            basicConfig.path = '/controller/12344';
            basicConfig.method = 'POST';
            var req = http.request(basicConfig, function(response) {
                var body = '';
                response.on('data', function(data) {
                    body += data;
                });
                response.on('end', function() {
                    body = JSON.parse(body);
                    expect(body.id).to.be('12344');
                    expect(body.verb).to.be('post');
                    done();
                });
            });
            req.write('');
            req.end();
        });
        it('should work for @DELETE', function(done) {
            basicConfig.path = '/controller/12344';
            basicConfig.method = 'DELETE'
            var req = http.request(basicConfig, function(response) {
                var body = '';
                response.on('data', function(data) {
                    body += data;
                });
                response.on('end', function() {
                    body = JSON.parse(body);
                    expect(body.id).to.be('12344');
                    expect(body.verb).to.be('delete');
                    done();
                });
            });
            req.end();
        });
        it('should work for @PUT', function(done) {
            basicConfig.path = '/controller/12344';
            basicConfig.method = 'PUT';
            var req = http.request(basicConfig, function(response) {
                var body = '';
                response.on('data', function(data) {
                    body += data;
                });
                response.on('end', function() {
                    body = JSON.parse(body);
                    expect(body.id).to.be('12344');
                    expect(body.verb).to.be('put');
                    done();
                });
            });
            req.write('');
            req.end();
        });
        it('should give 404 if not matched to request verb', function() {
            basicConfig.path = '/controller/no_put';
            basicConfig.method = 'PUT';
            var deferred = Promise.defer();
            var req = http.request(basicConfig, function(response) {
                var body = '';
                response.on('data', function(data) {
                    body += data;
                });
                response.on('end', function() {
                    expect(response.status).to.be(404);
                    deferred.resolve();
                });
            });
            req.write('');
            req.end();

            deferred.then(function() {
                basicConfig.method = 'GET';
                var req = http.request(basicConfig, function(response) {
                    var body = '';
                    response.on('data', function(data) {
                        body += data;
                    });
                    response.on('end', function() {
                        body = JSON.parse(body);
                        expect(response.status).to.be(200);
                        expect(body.say).to.be('what');
                        done()
                    });
                });
                req.end();
            })

        });
    });
});