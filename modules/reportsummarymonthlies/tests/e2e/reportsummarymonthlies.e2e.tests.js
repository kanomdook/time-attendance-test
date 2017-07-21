'use strict';

describe('Reportsummarymonthlies E2E Tests:', function () {
  describe('Test Reportsummarymonthlies page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/reportsummarymonthlies');
      expect(element.all(by.repeater('reportsummarymonthly in reportsummarymonthlies')).count()).toEqual(0);
    });
  });
});
