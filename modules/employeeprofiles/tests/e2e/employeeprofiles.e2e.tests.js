'use strict';

describe('Employeeprofiles E2E Tests:', function () {
  describe('Test Employeeprofiles page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/employeeprofiles');
      expect(element.all(by.repeater('employeeprofile in employeeprofiles')).count()).toEqual(0);
    });
  });
});
