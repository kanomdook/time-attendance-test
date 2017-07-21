'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Reportsummarymonthly = mongoose.model('Reportsummarymonthly');

/**
 * Globals
 */
var user,
  reportsummarymonthly;

/**
 * Unit tests
 */
describe('Reportsummarymonthly Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      reportsummarymonthly = new Reportsummarymonthly({
        name: 'Reportsummarymonthly Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return reportsummarymonthly.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      reportsummarymonthly.name = '';

      return reportsummarymonthly.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Reportsummarymonthly.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
