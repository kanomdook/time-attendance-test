'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Company = mongoose.model('Company');

/**
 * Globals
 */
var user,
  company;

/**
 * Unit tests
 */
describe('Company Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      company = new Company({
        name: 'Company Name',
        address: {
          address: 'Address Name',
          district: 'District Name',
          subdistrict: 'Subdistrict Name',
          postcode: 'Postcode Name',
          province: 'Province Name'
        },
        tel: 'Tel',
        fax: 'Fax',
        email: 'Email',
        website: 'Website',
        note: 'Note',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return company.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      company.name = '';

      return company.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Company.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
