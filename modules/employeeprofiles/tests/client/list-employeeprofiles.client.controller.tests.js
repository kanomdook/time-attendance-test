(function () {
  'use strict';

  describe('Employeeprofiles List Controller Tests', function () {
    // Initialize global variables
    var EmployeeprofilesListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      EmployeeprofilesService,
      mockEmployeeprofile;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _EmployeeprofilesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      EmployeeprofilesService = _EmployeeprofilesService_;

      // create mock article
      mockEmployeeprofile = new EmployeeprofilesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Employeeprofile Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Employeeprofiles List controller.
      EmployeeprofilesListController = $controller('EmployeeprofilesListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockEmployeeprofileList;

      beforeEach(function () {
        mockEmployeeprofileList = [mockEmployeeprofile, mockEmployeeprofile];
      });

      it('should send a GET request and return all Employeeprofiles', inject(function (EmployeeprofilesService) {
        // Set POST response
        $httpBackend.expectGET('api/employeeprofiles').respond(mockEmployeeprofileList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.employeeprofiles.length).toEqual(2);
        expect($scope.vm.employeeprofiles[0]).toEqual(mockEmployeeprofile);
        expect($scope.vm.employeeprofiles[1]).toEqual(mockEmployeeprofile);

      }));
    });
  });
}());
