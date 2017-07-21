'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Reportsummarymonthly = mongoose.model('Reportsummarymonthly'),
  User = mongoose.model('User'),
  Employeeprofile = mongoose.model('Employeeprofile'),
  Company = mongoose.model('Company'),
  Checkin = mongoose.model('Checkin'),
  Leave = mongoose.model('Leave'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  excel = require('node-excel-export');
/**
 * Create a Reportsummarymonthly
 */
exports.create = function (req, res) {
  var reportsummarymonthly = new Reportsummarymonthly(req.body);
  reportsummarymonthly.user = req.user;

  reportsummarymonthly.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reportsummarymonthly);
    }
  });
};

/**
 * Show the current Reportsummarymonthly
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var reportsummarymonthly = req.reportsummarymonthly ? req.reportsummarymonthly.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  reportsummarymonthly.isCurrentUserOwner = req.user && reportsummarymonthly.user && reportsummarymonthly.user._id.toString() === req.user._id.toString();

  res.jsonp(reportsummarymonthly);
};

/**
 * Update a Reportsummarymonthly
 */
exports.update = function (req, res) {
  var reportsummarymonthly = req.reportsummarymonthly;

  reportsummarymonthly = _.extend(reportsummarymonthly, req.body);

  reportsummarymonthly.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reportsummarymonthly);
    }
  });
};

/**
 * Delete an Reportsummarymonthly
 */
exports.delete = function (req, res) {
  var reportsummarymonthly = req.reportsummarymonthly;

  reportsummarymonthly.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reportsummarymonthly);
    }
  });
};

/**
 * List of Reportsummarymonthlies
 */
exports.list = function (req, res) {
  Reportsummarymonthly.find().sort('-created').populate('user', 'displayName').exec(function (err, reportsummarymonthlies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reportsummarymonthlies);
    }
  });
};

/**
 * Reportsummarymonthly middleware
 */
exports.reportsummarymonthlyByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Reportsummarymonthly is invalid'
    });
  }

  Reportsummarymonthly.findById(id).populate('user', 'displayName').exec(function (err, reportsummarymonthly) {
    if (err) {
      return next(err);
    } else if (!reportsummarymonthly) {
      return res.status(404).send({
        message: 'No Reportsummarymonthly with that identifier has been found'
      });
    }
    req.reportsummarymonthly = reportsummarymonthly;
    next();
  });
};
//////////////////////////////export report\\\\\\\\\\\\\\\\\\\\\\\\\\
exports.getCompanyID = function (req, res, next, companyID) {
  req.companyID = companyID;
  next();
};

exports.reportStarDate = function (req, res, next, startdate) {
  req.startdate = startdate;
  next();
};

exports.reportEndDate = function (req, res, next, enddate) {
  req.enddate = enddate;
  next();
};

exports.getUser = function (req, res, next) {
  Employeeprofile.find({'company': req.companyID})
    .populate('user')
    .populate('company')
    .exec(function (err, users) {
      console.log('========================User===================');
      console.log(users);
      console.log('===============================================');
      req.users = users;
      next();
    });
};

exports.getCheckin = function (req, res, next) {
  Checkin.find({ created: { $gte: new Date(req.startdate), $lt: new Date(req.enddate) } })
    .populate('user')
    .exec(function (err, checkin) {
      console.log('========================checkin===================');
      console.log(checkin);
      console.log('===============================================');
      req.checkin = checkin;
      next();
    });
};

exports.getLeave = function (req, res, next) {
  Leave.find()
    .populate('user')
    .exec(function (err, leave) {
      console.log('========================leave===================');
      console.log(leave);
      console.log('===============================================');
      req.leave = leave;
      next();
    });
};

exports.calculatDay = function (req, res, next) {
  var reportData = [];
  var companyShiftin = req.users[0].shiftin;
  for (var i = 0; i < req.users.length; i++) {
    reportData.push({
      id: req.users[i]._id,
      empID: req.users[i].employeeid,
      firstName: req.users[i].firstname,
      lastName: req.users[i].lastname
    });
  }

  for (var j = 0; j < req.users.length; j++) {
    var taskDay = [];
    reportData[j].late = {
      hours: 0,
      mins: 0
    };
    var hhhhh = 0;
    var mmmmm = 0;

    var leaveSick = [];
    var vacation = [];
    var personalLeave = [];

    for (var k = 0; k < req.checkin.length; k++) {
      if (req.users[j]._id.toString() === req.checkin[k].user.employeeprofile.toString()) {
        taskDay.push(req.checkin[k].dateTimeIn);
        reportData[j].taskDay = taskDay.length;
        var data = dateDiffLate(companyShiftin, req.checkin[k].dateTimeIn);
        if (data && data !== undefined) {
          reportData[j].late.hours += data.hh;
          reportData[j].late.mins += data.mm;
        }
      }
    }

    for (var l = 0; l < req.leave.length; l++) {
      if (req.users[j]._id.toString() === req.leave[l].user.employeeprofile.toString()) {
        if (req.leave[l].leaveType.toString() === 'Sick Leave') {
          leaveSick.push('Sick Leave');
          reportData[j].leaveSick = leaveSick.length;
        } else if (req.leave[l].leaveType.toString() === 'Vacation') {
          vacation.push('Vacation');
          reportData[j].vacation = vacation.length;
        } else if (req.leave[l].leaveType.toString() === 'Personal Leave') {
          personalLeave.push('Personal Leave');
          reportData[j].personalLeave = personalLeave.length;
        }
      }
    }
  }

  if (req.checkin.length <= 0) {
    req.reportData = [];
  } else {
    req.reportData = reportData;
  }
  next();
};

exports.exportExcel = function (req, res, next) {
  var styles = {
    headerDark: {
      fill: {
        fgColor: {
          rgb: 'FFFFFFFF'
        }
      },
      font: {
        color: {
          rgb: 'FF000000'
        },
        sz: 12,
        bold: false,
        underline: false
      }
    },
    default: {
      fill: {
        fgColor: {
          rgb: 'FFC0C0C0'
        }
      },
      font: {
        color: {
          rgb: 'FF000000'
        },
        sz: 12,
        bold: false,
        underline: false
      }
    }
  };

  var spStartDate = req.startdate.split('-');
  var spEndDate = req.enddate.split('-');

  var txtDateStart = spStartDate[2]+"/"+spStartDate[1]+"/"+spStartDate[0];
  var txtDateEnd = spEndDate[2]+"/"+spEndDate[1]+"/"+spEndDate[0];

  var heading = [
    [{ value: 'รายงานสรุปการมาทำงานของพนักงาน (รายเดือนแบบสรุป)', style: styles.headerDark }],
    ["ระหว่างวันที่ "+txtDateStart+" ถึง "+txtDateEnd]
  ];

  var specification = {
    number: { // <- the key should match the actual data key 
      displayName: 'ลำดับ', // <- Here you specify the column header 
      headerStyle: styles.default, // <- Header style 
      width: 40 // <- width in pixels 
    },
    empID: { // <- the key should match the actual data key 
      displayName: 'รหัสพนักงาน', // <- Here you specify the column header 
      headerStyle: styles.default, // <- Header style 
      width: 80 // <- width in pixels 
    },
    firstName: { // <- the key should match the actual data key 
      displayName: 'ชื่อ', // <- Here you specify the column header 
      headerStyle: styles.default, // <- Header style 
      width: 80 // <- width in pixels 
    },
    lastName: { // <- the key should match the actual data key 
      displayName: 'นามสกุล', // <- Here you specify the column header 
      headerStyle: styles.default, // <- Header style 
      width: 80 // <- width in pixels 
    },
    taskDay: { // <- the key should match the actual data key 
      displayName: 'วันทำงาน (วัน)', // <- Here you specify the column header 
      headerStyle: styles.default, // <- Header style 
      width: 80 // <- width in pixels 
    },
    late: { // <- the key should match the actual data key 
      displayName: 'มาสาย (ชม.)', // <- Here you specify the column header 
      headerStyle: styles.default, // <- Header style 
      width: 80 // <- width in pixels 
    },
    leaveSick: { // <- the key should match the actual data key 
      displayName: 'ลาป่วย (วัน)', // <- Here you specify the column header 
      headerStyle: styles.default, // <- Header style 
      width: 80 // <- width in pixels 
    },
    vacation: { // <- the key should match the actual data key 
      displayName: 'ลาพักร้อน (วัน)', // <- Here you specify the column header 
      headerStyle: styles.default, // <- Header style 
      width: 80 // <- width in pixels 
    },
    personalLeave: { // <- the key should match the actual data key 
      displayName: 'ลากิจ (วัน)', // <- Here you specify the column header 
      headerStyle: styles.default, // <- Header style 
      width: 80 // <- width in pixels 
    }
  };

  var dataSet = [];

  req.reportData.forEach(function (el, index) {
    dataSet.push({
      number: index + 1,
      empID: el.empID,
      firstName: el.firstName,
      lastName: el.lastName,
      taskDay: el.taskDay || 0,
      late: calhours(el.late.hours,el.late.mins),
      leaveSick: el.leaveSick || 0,
      vacation: el.vacation || 0,
      personalLeave: el.personalLeave || 0
    });
  });

  var report = excel.buildExport(
    [{
      name: 'Report', // <- Specify sheet name (optional) 
      heading: heading, // <- Raw heading array (optional) 
      specification: specification, // <- Report specification 
      data: dataSet // <-- Report data 
    }]
  );

  res.attachment('reportsummarymonthly.xlsx'); // This is sails.js specific (in general you need to set headers) 
  return res.send(report);
};

exports.sendReport = function (req, res, next) {
  res.json(req.reportData);
};

function dateDiffLate(companyShiftin, dateTimeIn) {
  if (dateTimeIn && dateTimeIn !== undefined) {
    var compShiftin = new Date(companyShiftin);
    var timein = new Date(dateTimeIn);
    if (timein.getHours() >= compShiftin.getHours() && timein.getMinutes() > compShiftin.getMinutes()) {
      var hh = timein.getHours() - compShiftin.getHours();
      var mm = timein.getMinutes() - compShiftin.getMinutes();
      var data = {
        hh: hh || 0,
        mm: mm || 0
      };
      return data;
    }
  }
}

function calhours(h,m){
  var hh = Math.floor(parseInt(m) / 60);
  var totalH = parseInt(h) + hh;
  return totalH;
}

