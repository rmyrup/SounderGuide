'use strict';

var sgServices = angular.module('sgServices', ['ngResource']);

sgServices.factory(
    'appData',
    [
        '$resource',
        function($resource)
        {
            return $resource(
                'json/:file.json',
                {},
                {
                    stations: {
                        method:'GET',
                        params:{file: 'schedule'},
                        isArray:true
                    },
                    trains: {
                        method:'GET',
                        params:{file: 'schedule_by_train'},
                        isArray:true
                    }

                }
            );
        }
    ]
);