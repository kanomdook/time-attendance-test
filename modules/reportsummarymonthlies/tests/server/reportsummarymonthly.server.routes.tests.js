'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Reportsummarymonthly = mongoose.model('Reportsummarymonthly'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  reportsummarymonthly;

/**
 * Reportsummarymonthly routes tests
 */
describe('Reportsummarymonthly CRUD tests', function () {

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

    // Save a user to the test db and create new Reportsummarymonthly
    user.save(function () {
      reportsummarymonthly = {
        name: 'Reportsummarymonthly name'
      };

      done();
    });
  });

  it('should be able to save a Reportsummarymonthly if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Reportsummarymonthly
        agent.post('/api/reportsummarymonthlies')
          .send(reportsummarymonthly)
          .expect(200)
          .end(function (reportsummarymonthlySaveErr, reportsummarymonthlySaveRes) {
            // Handle Reportsummarymonthly save error
            if (reportsummarymonthlySaveErr) {
              return done(reportsummarymonthlySaveErr);
            }

            // Get a list of Reportsummarymonthlies
            agent.get('/api/reportsummarymonthlies')
              .end(function (reportsummarymonthliesGetErr, reportsummarymonthliesGetRes) {
                // Handle Reportsummarymonthlies save error
                if (reportsummarymonthliesGetErr) {
                  return done(reportsummarymonthliesGetErr);
                }

                // Get Reportsummarymonthlies list
                var reportsummarymonthlies = reportsummarymonthliesGetRes.body;

                // Set assertions
                (reportsummarymonthlies[0].user._id).should.equal(userId);
                (reportsummarymonthlies[0].name).should.match('Reportsummarymonthly name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Reportsummarymonthly if not logged in', function (done) {
    agent.post('/api/reportsummarymonthlies')
      .send(reportsummarymonthly)
      .expect(403)
      .end(function (reportsummarymonthlySaveErr, reportsummarymonthlySaveRes) {
        // Call the assertion callback
        done(reportsummarymonthlySaveErr);
      });
  });

  it('should not be able to save an Reportsummarymonthly if no name is provided', function (done) {
    // Invalidate name field
    reportsummarymonthly.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Reportsummarymonthly
        agent.post('/api/reportsummarymonthlies')
          .send(reportsummarymonthly)
          .expect(400)
          .end(function (reportsummarymonthlySaveErr, reportsummarymonthlySaveRes) {
            // Set message assertion
            (reportsummarymonthlySaveRes.body.message).should.match('Please fill Reportsummarymonthly name');

            // Handle Reportsummarymonthly save error
            done(reportsummarymonthlySaveErr);
          });
      });
  });

  it('should be able to update an Reportsummarymonthly if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Reportsummarymonthly
        agent.post('/api/reportsummarymonthlies')
          .send(reportsummarymonthly)
          .expect(200)
          .end(function (reportsummarymonthlySaveErr, reportsummarymonthlySaveRes) {
            // Handle Reportsummarymonthly save error
            if (reportsummarymonthlySaveErr) {
              return done(reportsummarymonthlySaveErr);
            }

            // Update Reportsummarymonthly name
            reportsummarymonthly.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Reportsummarymonthly
            agent.put('/api/reportsummarymonthlies/' + reportsummarymonthlySaveRes.body._id)
              .send(reportsummarymonthly)
              .expect(200)
              .end(function (reportsummarymonthlyUpdateErr, reportsummarymonthlyUpdateRes) {
                // Handle Reportsummarymonthly update error
                if (reportsummarymonthlyUpdateErr) {
                  return done(reportsummarymonthlyUpdateErr);
                }

                // Set assertions
                (reportsummarymonthlyUpdateRes.body._id).should.equal(reportsummarymonthlySaveRes.body._id);
                (reportsummarymonthlyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Reportsummarymonthlies if not signed in', function (done) {
    // Create new Reportsummarymonthly model instance
    var reportsummarymonthlyObj = new Reportsummarymonthly(reportsummarymonthly);

    // Save the reportsummarymonthly
    reportsummarymonthlyObj.save(function () {
      // Request Reportsummarymonthlies
      request(app).get('/api/reportsummarymonthlies')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Reportsummarymonthly if not signed in', function (done) {
    // Create new Reportsummarymonthly model instance
    var reportsummarymonthlyObj = new Reportsummarymonthly(reportsummarymonthly);

    // Save the Reportsummarymonthly
    reportsummarymonthlyObj.save(function () {
      request(app).get('/api/reportsummarymonthlies/' + reportsummarymonthlyObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', reportsummarymonthly.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Reportsummarymonthly with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/reportsummarymonthlies/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Reportsummarymonthly is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Reportsummarymonthly which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Reportsummarymonthly
    request(app).get('/api/reportsummarymonthlies/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Reportsummarymonthly with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Reportsummarymonthly if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Reportsummarymonthly
        agent.post('/api/reportsummarymonthlies')
          .send(reportsummarymonthly)
          .expect(200)
          .end(function (reportsummarymonthlySaveErr, reportsummarymonthlySaveRes) {
            // Handle Reportsummarymonthly save error
            if (reportsummarymonthlySaveErr) {
              return done(reportsummarymonthlySaveErr);
            }

            // Delete an existing Reportsummarymonthly
            agent.delete('/api/reportsummarymonthlies/' + reportsummarymonthlySaveRes.body._id)
              .send(reportsummarymonthly)
              .expect(200)
              .end(function (reportsummarymonthlyDeleteErr, reportsummarymonthlyDeleteRes) {
                // Handle reportsummarymonthly error error
                if (reportsummarymonthlyDeleteErr) {
                  return done(reportsummarymonthlyDeleteErr);
                }

                // Set assertions
                (reportsummarymonthlyDeleteRes.body._id).should.equal(reportsummarymonthlySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Reportsummarymonthly if not signed in', function (done) {
    // Set Reportsummarymonthly user
    reportsummarymonthly.user = user;

    // Create new Reportsummarymonthly model instance
    var reportsummarymonthlyObj = new Reportsummarymonthly(reportsummarymonthly);

    // Save the Reportsummarymonthly
    reportsummarymonthlyObj.save(function () {
      // Try deleting Reportsummarymonthly
      request(app).delete('/api/reportsummarymonthlies/' + reportsummarymonthlyObj._id)
        .expect(403)
        .end(function (reportsummarymonthlyDeleteErr, reportsummarymonthlyDeleteRes) {
          // Set message assertion
          (reportsummarymonthlyDeleteRes.body.message).should.match('User is not authorized');

          // Handle Reportsummarymonthly error error
          done(reportsummarymonthlyDeleteErr);
        });

    });
  });

  it('should be able to get a single Reportsummarymonthly that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Reportsummarymonthly
          agent.post('/api/reportsummarymonthlies')
            .send(reportsummarymonthly)
            .expect(200)
            .end(function (reportsummarymonthlySaveErr, reportsummarymonthlySaveRes) {
              // Handle Reportsummarymonthly save error
              if (reportsummarymonthlySaveErr) {
                return done(reportsummarymonthlySaveErr);
              }

              // Set assertions on new Reportsummarymonthly
              (reportsummarymonthlySaveRes.body.name).should.equal(reportsummarymonthly.name);
              should.exist(reportsummarymonthlySaveRes.body.user);
              should.equal(reportsummarymonthlySaveRes.body.user._id, orphanId);

              // force the Reportsummarymonthly to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Reportsummarymonthly
                    agent.get('/api/reportsummarymonthlies/' + reportsummarymonthlySaveRes.body._id)
                      .expect(200)
                      .end(function (reportsummarymonthlyInfoErr, reportsummarymonthlyInfoRes) {
                        // Handle Reportsummarymonthly error
                        if (reportsummarymonthlyInfoErr) {
                          return done(reportsummarymonthlyInfoErr);
                        }

                        // Set assertions
                        (reportsummarymonthlyInfoRes.body._id).should.equal(reportsummarymonthlySaveRes.body._id);
                        (reportsummarymonthlyInfoRes.body.name).should.equal(reportsummarymonthly.name);
                        should.equal(reportsummarymonthlyInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Reportsummarymonthly.remove().exec(done);
    });
  });
});
