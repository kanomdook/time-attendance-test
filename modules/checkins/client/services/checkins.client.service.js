// Checkins service used to communicate Checkins REST endpoints
(function () {
  'use strict';

  angular
    .module('checkins')
    .factory('CheckinsService', CheckinsService);

  CheckinsService.$inject = ['$resource'];

  function CheckinsService($resource) {
    return $resource('api/checkin/company/:checkinId', {
      checkinId: '@_id'
    }, {
        update: {
          method: 'PUT'
        }
      });
  }
}());
