'use strict';

var sgApp = angular.module(
    'sgApp',
    [
        'ngRoute',

        'sgControllers',
        'sgServices',
        'sgFilters'
    ]
);

sgApp.config([
    '$routeProvider',
    function($routeProvider) {
        // TODO add app routes
    }
]);