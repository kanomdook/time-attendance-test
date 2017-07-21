(function () {
  'use strict';

  // Leaves controller
  angular
    .module('leaves')
    .controller('LeavesController', LeavesController);

  LeavesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'leaveResolve','$http'];

  function LeavesController($scope, $state, $window, Authentication, leave, $http) {
    var vm = this;

    vm.authentication = Authentication;
    vm.leave = leave;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.approve = approve;
    vm.reject = reject;

    $scope.initViewCard = function(){
      $http.get('/api/employeeprofiles/'+vm.leave.user.employeeprofile).success(function (employeeprofile) {
        vm.employeeprofile = employeeprofile;
      }).error(function (error) {
      });
    };

    // Remove existing Leave
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.leave.$remove($state.go('leaves.list'));
      }
    }

    function approve() {
      vm.leave.approveStatus = 'Approve';
      console.log(vm.leave.approveStatus);
      $http.put('/api/leaves/'+vm.leave._id, vm.leave).success(function (res) {
        // $window.location.href = '/leaves';
        $state.go('leaves.list');
      }).error(function (err) {
        console.error(err);
      });
    }

    function reject() {
      vm.leave.approveStatus = 'Reject';
      console.log(vm.leave.approveStatus);
      $http.put('/api/leaves/'+vm.leave._id, vm.leave).success(function (res) {
        // $window.location.href = '/leaves';
        $state.go('leaves.list');        
      }).error(function (err) {
        console.error(err);
      });
    }

    // Save Leave
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.leaveForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.leave._id) {
        vm.leave.$update(successCallback, errorCallback);
      } else {
        vm.leave.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('leaves.view', {
          leaveId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
