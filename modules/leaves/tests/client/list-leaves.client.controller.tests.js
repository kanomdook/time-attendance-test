(function () {
  'use strict';

  describe('Leaves List Controller Tests', function () {
    // Initialize global variables
    var LeavesListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      LeavesService,
      mockLeave;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _LeavesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      LeavesService = _LeavesService_;

      // create mock article
      mockLeave = new LeavesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Leave Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Leaves List controller.
      LeavesListController = $controller('LeavesListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockLeaveList;

      beforeEach(function () {
        mockLeaveList = [mockLeave, mockLeave];
      });

      it('should send a GET request and return all Leaves', inject(function (LeavesService) {
        // Set POST response
        $httpBackend.expectGET('api/leaves').respond(mockLeaveList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.leaves.length).toEqual(2);
        expect($scope.vm.leaves[0]).toEqual(mockLeave);
        expect($scope.vm.leaves[1]).toEqual(mockLeave);

      }));
    });
  });
}());
