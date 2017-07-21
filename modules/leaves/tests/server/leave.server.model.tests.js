'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Leave = mongoose.model('Leave');

/**
 * Globals
 */
var user,
  leave;

/**
 * Unit tests
 */
describe('Leave Model Unit Tests:', function() {
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
      leave = new Leave({
        email: 'jame@jame.com',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return leave.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without email', function(done) {
      leave.email = '';

      return leave.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Leave.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
