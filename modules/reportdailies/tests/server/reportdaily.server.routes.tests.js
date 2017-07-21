'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Company = mongoose.model('Company'),
  Employeeprofile = mongoose.model('Employeeprofile'),
  Checkin = mongoose.model('Checkin'),
  Reportdaily = mongoose.model('Reportdaily'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  admin,
  reportdaily,
  company,
  checkin,
  employeeprofile,
  empid;

/**
 * Reportdaily routes tests
 */
describe('Reportdaily CRUD tests', function () {

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
    admin = new User({
      firstName: 'admin',
      lastName: 'admin',
      displayName: 'admin admin',
      email: 'admin@admin.com',
      username: 'admin',
      password: 'P@ssw0rd1234',
      provider: 'local'
    });

    company = new Company({
      name: 'C@NET',
      user: admin
    });

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local',
      company: company,
      roles: ['admin']
    });

    checkin = new Checkin(
      {
        user: user,
        email: user.email,
        dateTimeIn: '2017-07-19T01:03:21.077Z',
        dateTimeOut: new Date(),
        type: 'Android',
        locationOut: {
          lat: '13.9336584',
          lng: '100.7180081'
        },
        locationIn: {
          lat: '13.9336584',
          lng: '100.7180081'
        },
        created: '2017-07-19T01:03:21.077Z'
      }
    );

    employeeprofile = new Employeeprofile({
      email: user.email,
      employeeid: '11111',
      shiftin: '1970-01-01T09:00:00.000+07:00',
      shiftout: '1970-01-01T18:00:00.000+07:00',
      company: company,
      firstname: 'dook',
      branchs: {
        latitude: '13.9336584',
        longitude: '100.7180081'
      }
    });

    //user.employeeprofile = employeeprofile;


    // Save a user to the test db and create new Reportdaily
    admin.save(function () {
      company.save(function () {
        user.save(function () {
          employeeprofile.save(function () {
            checkin.save(function () {
              reportdaily = {
                name: 'Reportdaily name'
              };

              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (signinErr, signinRes) {
                  // Handle signin error
                  if (signinErr) {
                    return done(signinErr);
                  }

                  signinRes.body.should.be.instanceof(Object);
                  signinRes.body.firstName.should.be.equal('Full');

                  // Call the assertion callback
                  done();
                });
            });
          });
        });
      });

    });

  });

  // it('MDW0 login', function (done) {
  //   agent.post('/api/auth/signin')
  //       .send(credentials)
  //       .expect(200)
  //       .end(function (signinErr, signinRes) {
  //         // Handle signin error
  //         if (signinErr) {
  //           return done(signinErr);
  //         }

  //             signinRes.body.should.be.instanceof(Object);
  //             signinRes.body.firstName.should.be.equal('Full');

  //             // Call the assertion callback
  //             done();
  //       });
  // });

  it('MDW1 respons date', function (done) {
    agent.get('/api/reportdaily/2017-07-19')
      .end(function (req, res) {
        // Set assertion
        // res.body.should.be.instanceof(Object).and.have.property('date', 'No date');

        (res.body.date).should.equal('2017-07-19');
        (res.body.user.firstName).should.equal(user.firstName);
        // (res.body.user.company).should.equal('');

        // Call the assertion callback
        done();
      });
  });

  it('MDW2 respons company', function (done) {
    agent.get('/api/reportdaily/2017-07-19')
      .end(function (req, res) {
        // Set assertion
        // res.body.should.be.instanceof(Object).and.have.property('message', 'No Reportmonthly with that identifier has been found');
        (res.body.date).should.equal('2017-07-19');
        (res.body.company.name).should.equal('C@NET');

        // Call the assertion callback
        done();
      });
  });

  it('MDW3 respons date', function (done) {
    agent.get('/api/reportdaily/2017-07-19')
      .end(function (req, res) {
        // Set assertion
        // res.body.should.be.instanceof(Object).and.have.property('message', 'No Reportmonthly with that identifier has been found');
        (res.body.date).should.equal('2017-07-19');
        (res.body.company.name).should.equal('C@NET');
        (res.body.data.length).should.equal(1);
        (res.body.data[0].firstName).should.equal('dook');
        (res.body.data[0].timelate).should.equal('00:00');
        //(res.body.data[0].workinghours).should.equal('06:05');
        (res.body.data[0].distance).should.equal(0);
        (res.body.data[0].distanceout).should.equal(0);
        // Call the assertion callback
        done();
      });
  });


  it('MDW1 reportmonth', function (done) {
    agent.get('/api/reportdaily/month/2017-07-19/11111')
      .end(function (req, res) {
        // Set assertion
        // res.body.should.be.instanceof(Object).and.have.property('message', 'No Reportmonthly with that identifier has been found');
        //(res.body.date).should.equal('');
        (res.body.data).should.equal('');
        (res.body.data.length).should.equal(1);

        // Call the assertion callback
        done();
      });
  });

  // it('MDW2 reportmonth', function (done) {

  //     agent.get('/api/reportdaily/month/2017-07-19/' + employeeprofile)
  //       .end(function (req, res) {
  //         // Set assertion
  //         // res.body.should.be.instanceof(Object).and.have.property('message', 'No Reportmonthly with that identifier has been found');
  //         (res.body.employeeprofile.email).should.equal(employeeprofile.email);
  //         (res.body.data.length).should.equal(1);

  //         // Call the assertion callback
  //         done();
  //       });

  // });

  afterEach(function (done) {
    User.remove().exec(function () {
      Employeeprofile.remove().exec(function () {
        Company.remove().exec(function () {
          Checkin.remove().exec(function () {
            Reportdaily.remove().exec(done);
          });
        });
      });
    });
  });
});
