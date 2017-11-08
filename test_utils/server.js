var Express = require('express'),
    AnnotationModule = require('../index');

var annotationInstance = new AnnotationModule(),
    app = new Express();

annotationInstance.setControllerRoutes('./test_utils/controller');
app.use(annotationInstance.handle)
    .listen(30128);