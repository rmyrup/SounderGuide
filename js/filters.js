'use strict';

angular.module('sgFilters', [])
    .filter('filterArrivals', function(){
        return function byStationFilter(arrivals)
        {

            // operate on an array of new items
            var arrivalsToCome = [];

            // only process if there are items
            if(arrivals && arrivals.length)
            {
                // setup some date formatting
                var now = moment();

                // loop each arrival and calculate some data
                for(var a in arrivals)
                {
                    var arrival = arrivals[a];

                    // get a moment for this arrival
                    var arrivesWhen = moment(new Date(
                        now.format('YYYY'),
                        (parseInt(now.format('MM')) - 1),
                        now.format('DD'),
                        arrival.when.substr(0, 2),
                        arrival.when.substr(3, 2)
                    ));
                    arrival.whenStr = arrivesWhen.format('LT');

                    // get the difference in minutes from now to the moment of arrival
                    var arrivesIn = arrivesWhen.diff(now, 'minutes');

                    // set the new properties
                    arrival.wait = arrivesIn;
                    arrival.waitStr = (arrivesIn >= 60) ? (arrivesIn / 60).toFixed(1) + ' hrs' : arrivesIn + ' mins';

                    // only show arrivals in the future
                    if(arrivesIn > 0) arrivalsToCome.push(arrival);
                }
            }

            // sort the arrivals to come
            arrivalsToCome.sort(function(a, b)
            {
                // use the age (wait in minutes) as the sorting predicate
                return (a.wait - b.wait);
            });

            // send back the list to render in the table
            return arrivalsToCome;
        };
    }
);