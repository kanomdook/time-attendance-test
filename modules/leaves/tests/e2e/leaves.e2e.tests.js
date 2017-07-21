'use strict';

describe('Leaves E2E Tests:', function () {
  describe('Test Leaves page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/leaves');
      expect(element.all(by.repeater('leave in leaves')).count()).toEqual(0);
    });
  });
});
