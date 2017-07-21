'use strict';

//Directive used to set metisMenu and minimalize button
angular.module('core')
    .directive('sideNavigation', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                // Call metsi to build when user signup
                scope.$watch('authentication.user', function () {
                    $timeout(function () {
                        element.metisMenu();
                    });
                });
            }
        };
    })
    .directive('minimalizaSidebar', function ($timeout) {
        return {
            restrict: 'A',
            template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
            controller: function ($scope, $element) {
                $scope.minimalize = function () {
                    angular.element('body').toggleClass('mini-navbar');
                    if (!angular.element('body').hasClass('mini-navbar') || angular.element('body').hasClass('body-small')) {
                        // Hide menu in order to smoothly turn on when maximize menu
                        angular.element('#side-menu').hide();
                        // For smoothly turn on menu
                        $timeout(function () {
                            angular.element('#side-menu').fadeIn(400);
                        }, 200);
                    } else {
                        // Remove all inline style from jquery fadeIn function to reset menu state
                        angular.element('#side-menu').removeAttr('style');
                    }
                };
            }
        };
    })
    // autocomplete directive postcode
    .directive('typeahead', ['$compile', '$timeout', function ($compile, $timeout) {
        return {
            restrict: 'A',
            transclude: true,
            scope: {
                ngModel: '=',
                typeahead: '=',
                typeaheadCallback: '='
            },
            link: function (scope, elem, attrs) {
                var template = '<div class="dropdown"><ul class="dropdown-menu" ng-if="ngModel.length > 1" style="display:block; float: left; height: auto; max-height: 200px;    width: auto; overflow-y: scroll;" ng-hide="!ngModel.length || !filitered.length || selected"><li ng-repeat="item in filitered = (filitered | filter:{postcode:ngModel}) track by $index" ng-click="click(item)" style="cursor:pointer" ng-class="{active:$index==active}" ng-mouseenter="mouseenter($index)"><a>{{item.subdistrict}} {{item.district}} {{item.province}} {{item.postcode}}</a></li></ul></div>';
                var filterCustom = [];
                elem.bind('blur', function () {
                    $timeout(function () {
                        scope.selected = true;
                    }, 100);
                });

                elem.bind('keydown', function ($event) {
                    if ($event.keyCode === 38 && scope.active > 0) { // arrow up
                        scope.active--;
                        scope.$digest();
                    } else if (scope.filitered && ($event.keyCode === 40 && scope.active < scope.filitered.length - 1)) { // arrow down
                        scope.active++;
                        scope.$digest();
                    } else if ($event.keyCode === 13) { // enter
                        filterCustom = [];

                        if (scope.active === 0) {
                            scope.typeahead.forEach(function (e) {
                                if (e.postcode === scope.ngModel) {
                                    filterCustom.push(e);
                                }
                            });
                            scope.filitered = filterCustom;
                        }
                        scope.$apply(function () {
                            scope.click(scope.filitered[scope.active]);
                        });
                    }
                });

                scope.click = function (item) {
                    scope.ngModel = item.postcode;
                    scope.selected = item;
                    if (scope.typeaheadCallback) {
                        scope.typeaheadCallback(item);
                    }
                    elem[0].blur();
                };

                scope.mouseenter = function ($index) {
                    scope.active = $index;
                };

                scope.$watch('ngModel', function (input) {
                    if (scope.selected && scope.selected.postcode === input) {
                        return;
                    }

                    scope.active = 0;
                    scope.selected = false;

                    // if we have an exact match and there is only one item in the list, automatically select it
                    if (scope.filitered) {
                        if (input && scope.filitered.length === 1 && scope.filitered[0].name === input) {
                            scope.click(scope.filitered[0]);
                        }
                    }
                    if (scope.ngModel) {
                        if (scope.ngModel.length > 1) {
                            filterCustom = [];
                            if (scope.active === 0) {
                                scope.typeahead.forEach(function (e) {
                                    // if (e.postcode === scope.ngModel) {
                                    //     filterCustom.push(e);
                                    // }

                                    if (e.postcode.substr(0, scope.ngModel.length) === scope.ngModel) {
                                        filterCustom.push(e);
                                    }
                                });
                                scope.filitered = filterCustom;
                            }
                            if (scope.typeaheadCallback && scope.ngModel.length === 5) {
                                scope.typeaheadCallback(scope.filitered[0]);
                            }
                        }
                    }
                });

                elem.after($compile(template)(scope));
            }
        };
    }])
    // autocomplete directive language
    .directive('typeaheadLanguage', ['$compile', '$timeout', function ($compile, $timeout) {
        return {
            restrict: 'A',
            transclude: true,
            scope: {
                ngModel: '=',
                typeaheadLanguage: '=',
                typeaheadCallback: '='
            },
            link: function (scope, elem, attrs) {
                var template = '<div class="dropdown"><ul class="dropdown-menu" style="display:block; float: left; height: auto; max-height: 200px;    width: auto; overflow-y: scroll;" ng-hide="!ngModel.length || !filitered.length || selected"><li ng-repeat="item in filitered = (filitered | filter:ngModel) track by $index" ng-click="click(item)" style="cursor:pointer" ng-class="{active:$index==active}" ng-mouseenter="mouseenter($index)"><a>{{item.th}}, {{item.en.official}}</a></li></ul></div>';
                var filterCustom = [];
                elem.bind('blur', function () {
                    $timeout(function () {
                        scope.selected = true;
                    }, 100);
                });

                elem.bind('keydown', function ($event) {
                    if ($event.keyCode === 38 && scope.active > 0) { // arrow up
                        scope.active--;
                        scope.$digest();
                    } else if (scope.filitered && ($event.keyCode === 40 && scope.active < scope.filitered.length - 1)) { // arrow down
                        scope.active++;
                        scope.$digest();
                    } else if ($event.keyCode === 13) { // enter
                        filterCustom = [];

                        if (scope.active === 0) {
                            scope.typeaheadLanguage.forEach(function (e) {
                                if (e.postcode === scope.ngModel) {
                                    filterCustom.push(e);
                                }
                            });
                            scope.filitered = filterCustom;
                        }
                        scope.$apply(function () {
                            scope.click(scope.filitered[scope.active]);
                        });
                    }
                });

                scope.click = function (item) {
                    scope.ngModel = item.th;
                    scope.selected = item;
                    if (scope.typeaheadCallback) {
                        scope.typeaheadCallback(item);
                    }
                    elem[0].blur();
                };

                scope.mouseenter = function ($index) {
                    scope.active = $index;
                };

                scope.$watch('ngModel', function (input) {
                    if (scope.selected && scope.selected.postcode === input) {
                        return;
                    }

                    scope.active = 0;
                    scope.selected = false;

                    // if we have an exact match and there is only one item in the list, automatically select it
                    if (scope.filitered) {
                        if (input && scope.filitered.length === 1 && scope.filitered[0].name === input) {
                            scope.click(scope.filitered[0]);
                        }
                    }
                    if (scope.ngModel) {
                        filterCustom = [];
                        if (scope.active === 0) {
                            scope.filitered = scope.typeaheadLanguage;
                        }
                        if (scope.typeaheadCallback && scope.ngModel.length === 5) {
                            scope.typeaheadCallback(scope.filitered[0]);
                        }
                    }
                });

                elem.after($compile(template)(scope));
            }
        };
    }]);