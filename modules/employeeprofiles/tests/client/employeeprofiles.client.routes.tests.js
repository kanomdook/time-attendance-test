(function () {
  'use strict';

  describe('Employeeprofiles Route Tests', function () {
    // Initialize global variables
    var $scope,
      EmployeeprofilesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EmployeeprofilesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EmployeeprofilesService = _EmployeeprofilesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('employeeprofiles');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/employeeprofiles');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          EmployeeprofilesController,
          mockEmployeeprofile;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('employeeprofiles.view');
          $templateCache.put('modules/employeeprofiles/client/views/view-employeeprofile.client.view.html', '');

          // create mock Employeeprofile
          mockEmployeeprofile = new EmployeeprofilesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Employeeprofile Name'
          });

          // Initialize Controller
          EmployeeprofilesController = $controller('EmployeeprofilesController as vm', {
            $scope: $scope,
            employeeprofileResolve: mockEmployeeprofile
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:employeeprofileId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.employeeprofileResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            employeeprofileId: 1
          })).toEqual('/employeeprofiles/1');
        }));

        it('should attach an Employeeprofile to the controller scope', function () {
          expect($scope.vm.employeeprofile._id).toBe(mockEmployeeprofile._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/employeeprofiles/client/views/view-employeeprofile.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EmployeeprofilesController,
          mockEmployeeprofile;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('employeeprofiles.create');
          $templateCache.put('modules/employeeprofiles/client/views/form-employeeprofile.client.view.html', '');

          // create mock Employeeprofile
          mockEmployeeprofile = new EmployeeprofilesService();

          // Initialize Controller
          EmployeeprofilesController = $controller('EmployeeprofilesController as vm', {
            $scope: $scope,
            employeeprofileResolve: mockEmployeeprofile
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.employeeprofileResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/employeeprofiles/create');
        }));

        it('should attach an Employeeprofile to the controller scope', function () {
          expect($scope.vm.employeeprofile._id).toBe(mockEmployeeprofile._id);
          expect($scope.vm.employeeprofile._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/employeeprofiles/client/views/form-employeeprofile.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EmployeeprofilesController,
          mockEmployeeprofile;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('employeeprofiles.edit');
          $templateCache.put('modules/employeeprofiles/client/views/form-employeeprofile.client.view.html', '');

          // create mock Employeeprofile
          mockEmployeeprofile = new EmployeeprofilesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Employeeprofile Name'
          });

          // Initialize Controller
          EmployeeprofilesController = $controller('EmployeeprofilesController as vm', {
            $scope: $scope,
            employeeprofileResolve: mockEmployeeprofile
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:employeeprofileId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.employeeprofileResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            employeeprofileId: 1
          })).toEqual('/employeeprofiles/1/edit');
        }));

        it('should attach an Employeeprofile to the controller scope', function () {
          expect($scope.vm.employeeprofile._id).toBe(mockEmployeeprofile._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/employeeprofiles/client/views/form-employeeprofile.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
