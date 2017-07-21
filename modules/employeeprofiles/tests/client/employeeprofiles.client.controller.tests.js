(function () {
  'use strict';

  describe('Employeeprofiles Controller Tests', function () {
    // Initialize global variables
    var EmployeeprofilesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      EmployeeprofilesService,
      CompaniesService,
      mockEmployeeprofile,
      mockCompaniesService;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _EmployeeprofilesService_, _CompaniesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      EmployeeprofilesService = _EmployeeprofilesService_;
      CompaniesService = _CompaniesService_;

      // create mock Employeeprofile
      mockEmployeeprofile = new EmployeeprofilesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Employeeprofile Name'
      });
      mockCompaniesService = new CompaniesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'CompaniesService Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Employeeprofiles controller.
      EmployeeprofilesController = $controller('EmployeeprofilesController as vm', {
        $scope: $scope,
        employeeprofileResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    // describe('vm.save() as create', function () {
    //   var sampleEmployeeprofilePostData;

    //   beforeEach(function () {
    //     // Create a sample Employeeprofile object
    //     sampleEmployeeprofilePostData = new EmployeeprofilesService({
    //       name: 'Employeeprofile Name'
    //     });

    //     $scope.vm.employeeprofile = sampleEmployeeprofilePostData;
    //   });

    //   it('should send a POST request with the form input values and then locate to new object URL', inject(function (EmployeeprofilesService, CompaniesService) {
    //     // Set POST response        
    //     $httpBackend.expectGET('api/companies').respond(mockCompaniesService);
    //     // $httpBackend.flush();

    //     $httpBackend.expectPOST('api/employeeprofiles', sampleEmployeeprofilePostData).respond(mockEmployeeprofile);
    //     // Run controller functionality
    //     $scope.vm.save(true);
    //     $httpBackend.flush();
    //     // Test URL redirection after the Employeeprofile was created
    //     expect($state.go).toHaveBeenCalledWith('employeeprofiles.view', {
    //       employeeprofileId: mockEmployeeprofile._id
    //     });
    //   }));

    //   it('should set $scope.vm.error if error', function () {
    //     var errorMessage = 'this is an error message';

    //     $httpBackend.expectGET('api/companies').respond(mockCompaniesService);
    //     // $httpBackend.flush();

    //     $httpBackend.expectPOST('api/employeeprofiles', sampleEmployeeprofilePostData).respond(400, {
    //       message: errorMessage
    //     });

    //     $scope.vm.save(true);
    //     $httpBackend.flush();

    //     expect($scope.vm.error).toBe(errorMessage);
    //   });
    // });

    // describe('vm.save() as update', function () {
    //   beforeEach(function () {
    //     // Mock Employeeprofile in $scope
    //     $scope.vm.employeeprofile = mockEmployeeprofile;
    //   });

    //   it('should update a valid Employeeprofile', inject(function (EmployeeprofilesService, CompaniesService) {
    //     // Set PUT response
    //     $httpBackend.expectPUT(/api\/employeeprofiles\/([0-9a-fA-F]{24})$/).respond();

    //     // Run controller functionality
    //     $scope.vm.save(true);
    //     $httpBackend.flush();

    //     // Test URL location to new object
    //     expect($state.go).toHaveBeenCalledWith('employeeprofiles.view', {
    //       employeeprofileId: mockEmployeeprofile._id
    //     });
    //   }));

    //   it('should set $scope.vm.error if error', inject(function (EmployeeprofilesService) {
    //     var errorMessage = 'error';
    //     $httpBackend.expectPUT(/api\/employeeprofiles\/([0-9a-fA-F]{24})$/).respond(400, {
    //       message: errorMessage
    //     });

    //     $scope.vm.save(true);
    //     $httpBackend.flush();

    //     expect($scope.vm.error).toBe(errorMessage);
    //   }));
    // });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Employeeprofiles
        $scope.vm.employeeprofile = mockEmployeeprofile;
      });

      it('should delete the Employeeprofile and redirect to Employeeprofiles', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/employeeprofiles\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('employeeprofiles.list');
      });

      it('should should not delete the Employeeprofile and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
