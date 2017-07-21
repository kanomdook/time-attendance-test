(function () {
  'use strict';

  describe('Leaves Route Tests', function () {
    // Initialize global variables
    var $scope,
      LeavesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _LeavesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      LeavesService = _LeavesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('leaves');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/leaves');
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
          LeavesController,
          mockLeave;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('leaves.view');
          $templateCache.put('modules/leaves/client/views/view-leave.client.view.html', '');

          // create mock Leave
          mockLeave = new LeavesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Leave Name'
          });

          // Initialize Controller
          LeavesController = $controller('LeavesController as vm', {
            $scope: $scope,
            leaveResolve: mockLeave
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:leaveId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.leaveResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            leaveId: 1
          })).toEqual('/leaves/1');
        }));

        it('should attach an Leave to the controller scope', function () {
          expect($scope.vm.leave._id).toBe(mockLeave._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/leaves/client/views/view-leave.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          LeavesController,
          mockLeave;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('leaves.create');
          $templateCache.put('modules/leaves/client/views/form-leave.client.view.html', '');

          // create mock Leave
          mockLeave = new LeavesService();

          // Initialize Controller
          LeavesController = $controller('LeavesController as vm', {
            $scope: $scope,
            leaveResolve: mockLeave
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.leaveResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/leaves/create');
        }));

        it('should attach an Leave to the controller scope', function () {
          expect($scope.vm.leave._id).toBe(mockLeave._id);
          expect($scope.vm.leave._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/leaves/client/views/form-leave.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          LeavesController,
          mockLeave;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('leaves.edit');
          $templateCache.put('modules/leaves/client/views/form-leave.client.view.html', '');

          // create mock Leave
          mockLeave = new LeavesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Leave Name'
          });

          // Initialize Controller
          LeavesController = $controller('LeavesController as vm', {
            $scope: $scope,
            leaveResolve: mockLeave
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:leaveId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.leaveResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            leaveId: 1
          })).toEqual('/leaves/1/edit');
        }));

        it('should attach an Leave to the controller scope', function () {
          expect($scope.vm.leave._id).toBe(mockLeave._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/leaves/client/views/form-leave.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
