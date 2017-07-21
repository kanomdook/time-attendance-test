'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Leave = mongoose.model('Leave'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  leave;

/**
 * Leave routes tests
 */
describe('Leave CRUD tests', function () {

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

    // Save a user to the test db and create new Leave
    user.save(function () {
      leave = {
        email: 'jame@jame.com'
      };

      done();
    });
  });

  it('should be able to save a Leave if logged in', function (done) {
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

        // Save a new Leave
        agent.post('/api/leaves')
          .send(leave)
          .expect(200)
          .end(function (leaveSaveErr, leaveSaveRes) {
            // Handle Leave save error
            if (leaveSaveErr) {
              return done(leaveSaveErr);
            }

            // Get a list of Leaves
            agent.get('/api/leaves')
              .end(function (leavesGetErr, leavesGetRes) {
                // Handle Leaves save error
                if (leavesGetErr) {
                  return done(leavesGetErr);
                }

                // Get Leaves list
                var leaves = leavesGetRes.body;

                // Set assertions
                (leaves[0].user._id).should.equal(userId);
                (leaves[0].email).should.match('jame@jame.com');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Leave if not logged in', function (done) {
    agent.post('/api/leaves')
      .send(leave)
      .expect(403)
      .end(function (leaveSaveErr, leaveSaveRes) {
        // Call the assertion callback
        done(leaveSaveErr);
      });
  });

  it('should not be able to save an Leave if no email is provided', function (done) {
    // Invalidate name field
    leave.email = '';

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

        // Save a new Leave
        agent.post('/api/leaves')
          .send(leave)
          .expect(400)
          .end(function (leaveSaveErr, leaveSaveRes) {
            // Set message assertion
            (leaveSaveRes.body.message).should.match('Please fill email');

            // Handle Leave save error
            done(leaveSaveErr);
          });
      });
  });

  it('should be able to update an Leave if signed in', function (done) {
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

        // Save a new Leave
        agent.post('/api/leaves')
          .send(leave)
          .expect(200)
          .end(function (leaveSaveErr, leaveSaveRes) {
            // Handle Leave save error
            if (leaveSaveErr) {
              return done(leaveSaveErr);
            }

            // Update Leave name
            leave.email = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Leave
            agent.put('/api/leaves/' + leaveSaveRes.body._id)
              .send(leave)
              .expect(200)
              .end(function (leaveUpdateErr, leaveUpdateRes) {
                // Handle Leave update error
                if (leaveUpdateErr) {
                  return done(leaveUpdateErr);
                }

                // Set assertions
                (leaveUpdateRes.body._id).should.equal(leaveSaveRes.body._id);
                (leaveUpdateRes.body.email).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Leaves if not signed in', function (done) {
    // Create new Leave model instance
    var leaveObj = new Leave(leave);

    // Save the leave
    leaveObj.save(function () {
      // Request Leaves
      request(app).get('/api/leaves')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Leave if not signed in', function (done) {
    // Create new Leave model instance
    var leaveObj = new Leave(leave);

    // Save the Leave
    leaveObj.save(function () {
      request(app).get('/api/leaves/' + leaveObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('email', leave.email);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Leave with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/leaves/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Leave is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Leave which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Leave
    request(app).get('/api/leaves/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Leave with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Leave if signed in', function (done) {
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

        // Save a new Leave
        agent.post('/api/leaves')
          .send(leave)
          .expect(200)
          .end(function (leaveSaveErr, leaveSaveRes) {
            // Handle Leave save error
            if (leaveSaveErr) {
              return done(leaveSaveErr);
            }

            // Delete an existing Leave
            agent.delete('/api/leaves/' + leaveSaveRes.body._id)
              .send(leave)
              .expect(200)
              .end(function (leaveDeleteErr, leaveDeleteRes) {
                // Handle leave error error
                if (leaveDeleteErr) {
                  return done(leaveDeleteErr);
                }

                // Set assertions
                (leaveDeleteRes.body._id).should.equal(leaveSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Leave if not signed in', function (done) {
    // Set Leave user
    leave.user = user;

    // Create new Leave model instance
    var leaveObj = new Leave(leave);

    // Save the Leave
    leaveObj.save(function () {
      // Try deleting Leave
      request(app).delete('/api/leaves/' + leaveObj._id)
        .expect(403)
        .end(function (leaveDeleteErr, leaveDeleteRes) {
          // Set message assertion
          (leaveDeleteRes.body.message).should.match('User is not authorized');

          // Handle Leave error error
          done(leaveDeleteErr);
        });

    });
  });

  it('should be able to get a single Leave that has an orphaned user reference', function (done) {
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

          // Save a new Leave
          agent.post('/api/leaves')
            .send(leave)
            .expect(200)
            .end(function (leaveSaveErr, leaveSaveRes) {
              // Handle Leave save error
              if (leaveSaveErr) {
                return done(leaveSaveErr);
              }

              // Set assertions on new Leave
              (leaveSaveRes.body.email).should.equal(leave.email);
              should.exist(leaveSaveRes.body.user);
              should.equal(leaveSaveRes.body.user._id, orphanId);

              // force the Leave to have an orphaned user reference
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

                    // Get the Leave
                    agent.get('/api/leaves/' + leaveSaveRes.body._id)
                      .expect(200)
                      .end(function (leaveInfoErr, leaveInfoRes) {
                        // Handle Leave error
                        if (leaveInfoErr) {
                          return done(leaveInfoErr);
                        }

                        // Set assertions
                        (leaveInfoRes.body._id).should.equal(leaveSaveRes.body._id);
                        (leaveInfoRes.body.email).should.equal(leave.email);
                        should.equal(leaveInfoRes.body.user, undefined);

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
      Leave.remove().exec(done);
    });
  });
});
