// Leaves service used to communicate Leaves REST endpoints
(function () {
  'use strict';

  angular
    .module('leaves')
    .factory('LeavesService', LeavesService);

  LeavesService.$inject = ['$resource'];

  function LeavesService($resource) {
    return $resource('api/leave/company/:leaveId', {
      leaveId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
