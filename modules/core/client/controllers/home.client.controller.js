'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$state', '$window', '$location',
    function($scope, Authentication, $state, $window, $location) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        // Some example string
        if (!$scope.authentication.user) {
            $state.go('authentication.signin');
        } else {
            $location.path('/companies/' + $scope.authentication.user.company);
        }

    }
]);
