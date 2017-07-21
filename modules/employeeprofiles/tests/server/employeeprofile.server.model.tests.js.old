'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Employeeprofile = mongoose.model('Employeeprofile');

/**
 * Globals
 */
var user,
  employeeprofile;

/**
 * Unit tests
 */
describe('Employeeprofile Model Unit Tests:', function() {
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
      employeeprofile = new Employeeprofile({
        email:'jame@jame.com',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return employeeprofile.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without email', function(done) {
      employeeprofile.email = '';

      return employeeprofile.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Employeeprofile.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
