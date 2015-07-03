'use strict';

var sgControllers = angular.module('sgControllers', []);

sgControllers.controller(
    'sgCtrl',
    [
        '$scope',
        '$http',
        function($scope, $http)
        {
            $scope.watching = {
                station: '',
                timenow: moment().format('LT'),
                timer: setInterval(function(){ $scope.updateWatch(); }, 30000)
            };

            // load the schedule data
            $http.get('json/schedule.json').success(function(data){
                $scope.stations = data;
            });

            // call a model update
            $scope.updateWatch = function()
            {
                // update the time
                $scope.watching.timenow = moment().format('LT');

                // trigger the model update
                $('#station-list').trigger('change');
            };

            // centrally used to display messages in a panel
            $scope.outputMsg = function(msg, clear)
            {
                var pnl = $('#js-output');
                if(clear) pnl.text('');
                if(msg) pnl.text(pnl.text() + msg + '\n');
            };

            // locating functions
            $scope.geoloc = {
                doLoc: function() {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition($scope.geoloc.locShow, $scope.geoloc.locError);
                    }
                    else {
                        $scope.outputMsg('Geolocation is not supported by this browser. :(', true);
                    }
                },
                locShow: function(position) {
                    if ($scope.stations.length) {
                        var lowDist = false;
                        var lowIdx = false;
                        var lowName = false;

                        for (var i in $scope.stations) {
                            var station = $scope.stations[i];
                            var dist = distance(
                                position.coords.latitude,
                                position.coords.longitude,
                                station.Lat,
                                station.Lon
                            );

                            dist = parseFloat(dist.toFixed(2));

                            if (lowDist !== false) {
                                if (dist < lowDist) {
                                    lowDist = dist;
                                    lowIdx = i;
                                    lowName = station.Station;
                                }
                            }
                            else {
                                lowDist = dist;
                                lowIdx = i;
                                lowName = station.Station;
                            }
                        }

                        $('#station-list OPTION[value="' + lowIdx + '"]').prop('selected', true).trigger('change');
                        $scope.outputMsg('Watching ' + lowName + ' station.');
                    }
                    else {
                        $scope.outputMsg('No stations...  :(', true);
                    }
                },
                locError: function(error)
                {
                    var msg = 'Unknown error. Sorry. :(';

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            msg = 'User denied the request for location data.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            msg = 'Location data is not available.';
                            break;
                        case error.TIMEOUT:
                            msg = 'Request for location data timed out.';
                            break;
                    }

                    $scope.outputMsg(msg);
                }
            };
        }
    ]
);