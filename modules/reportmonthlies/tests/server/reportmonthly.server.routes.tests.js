'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Reportmonthly = mongoose.model('Reportmonthly'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  reportmonthly;

/**
 * Reportmonthly routes tests
 */
describe('Reportmonthly CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Reportmonthly
    user.save(function () {
      reportmonthly = {
        name: 'Reportmonthly name'
      };

      done();
    });
  });

  // it('MDW1 respons company', function (done) {
  //   agent.get('/api/reportmonth/2017-07-19/1234')
  //     .end(function (req, res) {
  //       // Set assertion
  //       // res.body.should.be.instanceof(Object).and.have.property('message', 'No Reportmonthly with that identifier has been found');
  //       (res.body.date).should.equal('2017-07-19');
  //       // (res.body.data.length).should.equal(1);

  //       // Call the assertion callback
  //       done();
  //     });
  // });

  afterEach(function (done) {
    User.remove().exec(function () {
      Reportmonthly.remove().exec(done);
    });
  });
});
