'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Checkin = mongoose.model('Checkin'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  checkin;

/**
 * Checkin routes tests
 */
describe('Checkin CRUD tests', function () {

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

    // Save a user to the test db and create new Checkin
    user.save(function () {
      checkin = {
        email: 'jame@jame.com'
      };

      done();
    });
  });

  it('should be able to save a Checkin if logged in', function (done) {
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

        // Save a new Checkin
        agent.post('/api/checkins')
          .send(checkin)
          .expect(200)
          .end(function (checkinSaveErr, checkinSaveRes) {
            // Handle Checkin save error
            if (checkinSaveErr) {
              return done(checkinSaveErr);
            }

            // Get a list of Checkins
            agent.get('/api/checkins')
              .end(function (checkinsGetErr, checkinsGetRes) {
                // Handle Checkins save error
                if (checkinsGetErr) {
                  return done(checkinsGetErr);
                }

                // Get Checkins list
                var checkins = checkinsGetRes.body;

                // Set assertions
                (checkins[0].user._id).should.equal(userId);
                (checkins[0].email).should.match('jame@jame.com');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Checkin if not logged in', function (done) {
    agent.post('/api/checkins')
      .send(checkin)
      .expect(403)
      .end(function (checkinSaveErr, checkinSaveRes) {
        // Call the assertion callback
        done(checkinSaveErr);
      });
  });

  it('should not be able to save an Checkin if no email is provided', function (done) {
    // Invalidate name field
    checkin.email = '';

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

        // Save a new Checkin
        agent.post('/api/checkins')
          .send(checkin)
          .expect(400)
          .end(function (checkinSaveErr, checkinSaveRes) {
            // Set message assertion
            (checkinSaveRes.body.message).should.match('Please fill email');

            // Handle Checkin save error
            done(checkinSaveErr);
          });
      });
  });

  it('should be able to update an Checkin if signed in', function (done) {
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

        // Save a new Checkin
        agent.post('/api/checkins')
          .send(checkin)
          .expect(200)
          .end(function (checkinSaveErr, checkinSaveRes) {
            // Handle Checkin save error
            if (checkinSaveErr) {
              return done(checkinSaveErr);
            }

            // Update Checkin name
            checkin.email = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Checkin
            agent.put('/api/checkins/' + checkinSaveRes.body._id)
              .send(checkin)
              .expect(200)
              .end(function (checkinUpdateErr, checkinUpdateRes) {
                // Handle Checkin update error
                if (checkinUpdateErr) {
                  return done(checkinUpdateErr);
                }

                // Set assertions
                (checkinUpdateRes.body._id).should.equal(checkinSaveRes.body._id);
                (checkinUpdateRes.body.email).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Checkins if not signed in', function (done) {
    // Create new Checkin model instance
    var checkinObj = new Checkin(checkin);

    // Save the checkin
    checkinObj.save(function () {
      // Request Checkins
      request(app).get('/api/checkins')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Checkin if not signed in', function (done) {
    // Create new Checkin model instance
    var checkinObj = new Checkin(checkin);

    // Save the Checkin
    checkinObj.save(function () {
      request(app).get('/api/checkins/' + checkinObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('email', checkin.email);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Checkin with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/checkins/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Checkin is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Checkin which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Checkin
    request(app).get('/api/checkins/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Checkin with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Checkin if signed in', function (done) {
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

        // Save a new Checkin
        agent.post('/api/checkins')
          .send(checkin)
          .expect(200)
          .end(function (checkinSaveErr, checkinSaveRes) {
            // Handle Checkin save error
            if (checkinSaveErr) {
              return done(checkinSaveErr);
            }

            // Delete an existing Checkin
            agent.delete('/api/checkins/' + checkinSaveRes.body._id)
              .send(checkin)
              .expect(200)
              .end(function (checkinDeleteErr, checkinDeleteRes) {
                // Handle checkin error error
                if (checkinDeleteErr) {
                  return done(checkinDeleteErr);
                }

                // Set assertions
                (checkinDeleteRes.body._id).should.equal(checkinSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Checkin if not signed in', function (done) {
    // Set Checkin user
    checkin.user = user;

    // Create new Checkin model instance
    var checkinObj = new Checkin(checkin);

    // Save the Checkin
    checkinObj.save(function () {
      // Try deleting Checkin
      request(app).delete('/api/checkins/' + checkinObj._id)
        .expect(403)
        .end(function (checkinDeleteErr, checkinDeleteRes) {
          // Set message assertion
          (checkinDeleteRes.body.message).should.match('User is not authorized');

          // Handle Checkin error error
          done(checkinDeleteErr);
        });

    });
  });

  it('should be able to get a single Checkin that has an orphaned user reference', function (done) {
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

          // Save a new Checkin
          agent.post('/api/checkins')
            .send(checkin)
            .expect(200)
            .end(function (checkinSaveErr, checkinSaveRes) {
              // Handle Checkin save error
              if (checkinSaveErr) {
                return done(checkinSaveErr);
              }

              // Set assertions on new Checkin
              (checkinSaveRes.body.email).should.equal(checkin.email);
              should.exist(checkinSaveRes.body.user);
              should.equal(checkinSaveRes.body.user._id, orphanId);

              // force the Checkin to have an orphaned user reference
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

                    // Get the Checkin
                    agent.get('/api/checkins/' + checkinSaveRes.body._id)
                      .expect(200)
                      .end(function (checkinInfoErr, checkinInfoRes) {
                        // Handle Checkin error
                        if (checkinInfoErr) {
                          return done(checkinInfoErr);
                        }

                        // Set assertions
                        (checkinInfoRes.body._id).should.equal(checkinSaveRes.body._id);
                        (checkinInfoRes.body.email).should.equal(checkin.email);
                        should.equal(checkinInfoRes.body.user, undefined);

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
      Checkin.remove().exec(done);
    });
  });
});
