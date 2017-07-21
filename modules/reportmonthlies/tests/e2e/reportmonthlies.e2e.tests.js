'use strict';

describe('Reportmonthlies E2E Tests:', function () {
  describe('Test Reportmonthlies page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/reportmonthlies');
      expect(element.all(by.repeater('reportmonthly in reportmonthlies')).count()).toEqual(0);
    });
  });
});
