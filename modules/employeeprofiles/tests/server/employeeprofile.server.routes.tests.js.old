'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Company = mongoose.model('Company'),
  Employeeprofile = mongoose.model('Employeeprofile'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  company,
  employeeprofile;

/**
 * Employeeprofile routes tests
 */
describe('Employeeprofile CRUD tests', function () {

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

    company = new Company({
      name: 'name'
    });

    // Save a user to the test db and create new Employeeprofile
    user.save(function () {
      employeeprofile = {
        email: 'jame@jame.com'
      };

      done();
    });
  });

  it('should be able to save a Employeeprofile if logged in', function (done) {
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

        // Save a new Employeeprofile
        agent.post('/api/employeeprofiles')
          .send(employeeprofile)
          .expect(200)
          .end(function (employeeprofileSaveErr, employeeprofileSaveRes) {
            // Handle Employeeprofile save error
            if (employeeprofileSaveErr) {
              return done(employeeprofileSaveErr);
            }

            // Get a list of Employeeprofiles
            agent.get('/api/employeeprofiles')
              .end(function (employeeprofilesGetErr, employeeprofilesGetRes) {
                // Handle Employeeprofiles save error
                if (employeeprofilesGetErr) {
                  return done(employeeprofilesGetErr);
                }

                // Get Employeeprofiles list
                var employeeprofiles = employeeprofilesGetRes.body;

                // Set assertions
                (employeeprofiles[0].user._id).should.equal(userId);
                (employeeprofiles[0].email).should.match('jame@jame.com');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Employeeprofile if not logged in', function (done) {
    agent.post('/api/employeeprofiles')
      .send(employeeprofile)
      .expect(403)
      .end(function (employeeprofileSaveErr, employeeprofileSaveRes) {
        // Call the assertion callback
        done(employeeprofileSaveErr);
      });
  });

  it('should not be able to save an Employeeprofile if no email is provided', function (done) {
    // Invalidate name field
    employeeprofile.email = '';

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

        // Save a new Employeeprofile
        agent.post('/api/employeeprofiles')
          .send(employeeprofile)
          .expect(400)
          .end(function (employeeprofileSaveErr, employeeprofileSaveRes) {
            // Set message assertion
            (employeeprofileSaveRes.body.message).should.match('Please fill email');

            // Handle Employeeprofile save error
            done(employeeprofileSaveErr);
          });
      });
  });

  it('should be able to update an Employeeprofile if signed in', function (done) {
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

        // Save a new Employeeprofile
        agent.post('/api/employeeprofiles')
          .send(employeeprofile)
          .expect(200)
          .end(function (employeeprofileSaveErr, employeeprofileSaveRes) {
            // Handle Employeeprofile save error
            if (employeeprofileSaveErr) {
              return done(employeeprofileSaveErr);
            }

            // Update Employeeprofile name
            employeeprofile.email = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Employeeprofile
            agent.put('/api/employeeprofiles/' + employeeprofileSaveRes.body._id)
              .send(employeeprofile)
              .expect(200)
              .end(function (employeeprofileUpdateErr, employeeprofileUpdateRes) {
                // Handle Employeeprofile update error
                if (employeeprofileUpdateErr) {
                  return done(employeeprofileUpdateErr);
                }

                // Set assertions
                (employeeprofileUpdateRes.body._id).should.equal(employeeprofileSaveRes.body._id);
                (employeeprofileUpdateRes.body.email).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Employeeprofiles if not signed in', function (done) {
    // Create new Employeeprofile model instance
    var employeeprofileObj = new Employeeprofile(employeeprofile);

    // Save the employeeprofile
    employeeprofileObj.save(function () {
      // Request Employeeprofiles
      request(app).get('/api/employeeprofiles')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Employeeprofile if not signed in', function (done) {
    // Create new Employeeprofile model instance
    var employeeprofileObj = new Employeeprofile(employeeprofile);

    // Save the Employeeprofile
    employeeprofileObj.save(function () {
      request(app).get('/api/employeeprofiles/' + employeeprofileObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('email', employeeprofile.email);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Employeeprofile with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/employeeprofiles/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Employeeprofile is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Employeeprofile which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Employeeprofile
    request(app).get('/api/employeeprofiles/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Employeeprofile with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Employeeprofile if signed in', function (done) {
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

        // Save a new Employeeprofile
        agent.post('/api/employeeprofiles')
          .send(employeeprofile)
          .expect(200)
          .end(function (employeeprofileSaveErr, employeeprofileSaveRes) {
            // Handle Employeeprofile save error
            if (employeeprofileSaveErr) {
              return done(employeeprofileSaveErr);
            }

            // Delete an existing Employeeprofile
            agent.delete('/api/employeeprofiles/' + employeeprofileSaveRes.body._id)
              .send(employeeprofile)
              .expect(200)
              .end(function (employeeprofileDeleteErr, employeeprofileDeleteRes) {
                // Handle employeeprofile error error
                if (employeeprofileDeleteErr) {
                  return done(employeeprofileDeleteErr);
                }

                // Set assertions
                (employeeprofileDeleteRes.body._id).should.equal(employeeprofileSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Employeeprofile if not signed in', function (done) {
    // Set Employeeprofile user
    employeeprofile.user = user;

    // Create new Employeeprofile model instance
    var employeeprofileObj = new Employeeprofile(employeeprofile);

    // Save the Employeeprofile
    employeeprofileObj.save(function () {
      // Try deleting Employeeprofile
      request(app).delete('/api/employeeprofiles/' + employeeprofileObj._id)
        .expect(403)
        .end(function (employeeprofileDeleteErr, employeeprofileDeleteRes) {
          // Set message assertion
          (employeeprofileDeleteRes.body.message).should.match('User is not authorized');

          // Handle Employeeprofile error error
          done(employeeprofileDeleteErr);
        });

    });
  });

  it('should be able to get a single Employeeprofile that has an orphaned user reference', function (done) {
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

          // Save a new Employeeprofile
          agent.post('/api/employeeprofiles')
            .send(employeeprofile)
            .expect(200)
            .end(function (employeeprofileSaveErr, employeeprofileSaveRes) {
              // Handle Employeeprofile save error
              if (employeeprofileSaveErr) {
                return done(employeeprofileSaveErr);
              }

              // Set assertions on new Employeeprofile
              (employeeprofileSaveRes.body.email).should.equal(employeeprofile.email);
              should.exist(employeeprofileSaveRes.body.user);
              should.equal(employeeprofileSaveRes.body.user._id, orphanId);

              // force the Employeeprofile to have an orphaned user reference
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

                    // Get the Employeeprofile
                    agent.get('/api/employeeprofiles/' + employeeprofileSaveRes.body._id)
                      .expect(200)
                      .end(function (employeeprofileInfoErr, employeeprofileInfoRes) {
                        // Handle Employeeprofile error
                        if (employeeprofileInfoErr) {
                          return done(employeeprofileInfoErr);
                        }

                        // Set assertions
                        (employeeprofileInfoRes.body._id).should.equal(employeeprofileSaveRes.body._id);
                        (employeeprofileInfoRes.body.email).should.equal(employeeprofile.email);
                        should.equal(employeeprofileInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });
  
  it('should be able to find a email not have Employeeprofile', function (done) {

    // Create orphan user
    var emp = new Employeeprofile({
      firstName: 'Full',
      lastName: 'Name',
      email: 'emp66@test.com'
    });
    var email = 'emp@test.com';
    emp.save(function (err, emp) {
      // Handle save error
      if (err) {
        return done(err);
      }
      request(app).get('/api/Employeeprofile/email/' + email)
        .end(function (req, res) {

          (res.body.firstname).should.match('');
          (res.body.lastname).should.match('');

          // Call the assertion callback
          done();
        });
    });
  });
  afterEach(function (done) {
    User.remove().exec(function () {
      Employeeprofile.remove().exec(done);
    });
  });
});
