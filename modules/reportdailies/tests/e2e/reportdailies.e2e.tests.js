'use strict';

describe('Reportdailies E2E Tests:', function () {
  describe('Test Reportdailies page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/reportdailies');
      expect(element.all(by.repeater('reportdaily in reportdailies')).count()).toEqual(0);
    });
  });
});
