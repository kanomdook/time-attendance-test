'use strict';

describe('Checkins E2E Tests:', function () {
  describe('Test Checkins page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/checkins');
      expect(element.all(by.repeater('checkin in checkins')).count()).toEqual(0);
    });
  });
});
