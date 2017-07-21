(function () {
  'use strict';

  describe('Checkins Route Tests', function () {
    // Initialize global variables
    var $scope,
      CheckinsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CheckinsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CheckinsService = _CheckinsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('checkins');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/checkins');
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
          CheckinsController,
          mockCheckin;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('checkins.view');
          $templateCache.put('modules/checkins/client/views/view-checkin.client.view.html', '');

          // create mock Checkin
          mockCheckin = new CheckinsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Checkin Name'
          });

          // Initialize Controller
          CheckinsController = $controller('CheckinsController as vm', {
            $scope: $scope,
            checkinResolve: mockCheckin
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:checkinId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.checkinResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            checkinId: 1
          })).toEqual('/checkins/1');
        }));

        it('should attach an Checkin to the controller scope', function () {
          expect($scope.vm.checkin._id).toBe(mockCheckin._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/checkins/client/views/view-checkin.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CheckinsController,
          mockCheckin;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('checkins.create');
          $templateCache.put('modules/checkins/client/views/form-checkin.client.view.html', '');

          // create mock Checkin
          mockCheckin = new CheckinsService();

          // Initialize Controller
          CheckinsController = $controller('CheckinsController as vm', {
            $scope: $scope,
            checkinResolve: mockCheckin
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.checkinResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/checkins/create');
        }));

        it('should attach an Checkin to the controller scope', function () {
          expect($scope.vm.checkin._id).toBe(mockCheckin._id);
          expect($scope.vm.checkin._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/checkins/client/views/form-checkin.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CheckinsController,
          mockCheckin;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('checkins.edit');
          $templateCache.put('modules/checkins/client/views/form-checkin.client.view.html', '');

          // create mock Checkin
          mockCheckin = new CheckinsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Checkin Name'
          });

          // Initialize Controller
          CheckinsController = $controller('CheckinsController as vm', {
            $scope: $scope,
            checkinResolve: mockCheckin
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:checkinId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.checkinResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            checkinId: 1
          })).toEqual('/checkins/1/edit');
        }));

        it('should attach an Checkin to the controller scope', function () {
          expect($scope.vm.checkin._id).toBe(mockCheckin._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/checkins/client/views/form-checkin.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
