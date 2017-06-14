/**
 * Create the module. Set it up to use html5 mode.
 */
window.MyOpennutch = angular.module('myOpennutch', ['elasticsearch'],
    ['$locationProvider', function($locationProvider){
        $locationProvider.html5Mode(true);
    }]
);

/**
 * Create a service to power calls to Elasticsearch. We only need to
 * use the _search endpoint.
 */
MyOpennutch.factory('docservice',
    ['$q', 'esFactory', '$location', function($q, elasticsearch, $location){
        var client = elasticsearch({
            host: $location.host() + ":9200"
        });

        /**
         * Given a term and an offset, load another round of 10 nutch.
         *
         * Returns a promise.
         */
        var search = function(term, offset){
            var deferred = $q.defer();
            var query = {
                "match": {
                    "_all": term
                }
            };

            client.search({
                "index": 'nutch',
                "type": 'doc',
                "body": {
                    "size": 10,
                    "from": (offset || 0) * 10,
                    "query": query
                }
            }).then(function(result) {
                var ii = 0, hits_in, hits_out = [];
                hits_in = (result.hits || {}).hits || [];
                for(;ii < hits_in.length; ii++){
                    hits_out.push(hits_in[ii]._source);
                }
                deferred.resolve(hits_out);
            }, deferred.reject);

            return deferred.promise;
        };


        return {
            "search": search
        };
    }]
);

/**
 * Create a controller to interact with the UI.
 */
MyOpennutch.controller('docCtrl',
    ['docservice', '$scope', '$location', function(nutch, $scope, $location){
        // Provide some nice initial choices
        var initChoices = [];
        var idx = Math.floor(Math.random() * initChoices.length);

        // Initialize the scope defaults.
        $scope.nutch = [];        // An array of doc results to display
        $scope.page = 0;            // A counter to keep track of our current page
        $scope.allResults = false;  // Whether or not all results have been found.

        // And, a random search term to start if none was present on page load.
        $scope.searchTerm = $location.search().q || initChoices[idx];

        /**
         * A fresh search. Reset the scope variables to their defaults, set
         * the q query parameter, and load more results.
         */
        $scope.search = function(){
            $scope.page = 0;
            $scope.nutch = [];
            $scope.allResults = false;
            $location.search({'q': $scope.searchTerm});
            $scope.loadMore();
        };

        /**
         * Load the next page of results, incrementing the page counter.
         * When query is finished, push results onto $scope.nutch and decide
         * whether all results have been returned (i.e. were 10 results returned?)
         */
        $scope.loadMore = function(){
            nutch.search($scope.searchTerm, $scope.page++).then(function(results){
                if(results.length !== 10){
                    $scope.allResults = true;
                }

                var ii = 0;
                for(;ii < results.length; ii++){
                    $scope.nutch.push(results[ii]);
                }
            });
        };

        // Load results on first run
        $scope.loadMore();
    }]
);
