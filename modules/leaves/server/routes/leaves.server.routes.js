'use strict';

/**
 * Module dependencies
 */
var leavesPolicy = require('../policies/leaves.server.policy'),
  leaves = require('../controllers/leaves.server.controller');

module.exports = function (app) {
  // Leaves Routes
  app.route('/api/leaves').all(leavesPolicy.isAllowed)
    .get(leaves.list)
    .post(leaves.create);

    app.route('/api/getLeaveByLeaveTypeAndDate').all(leavesPolicy.isAllowed)
    .post(leaves.getLeaveByLeaveTypeAndDate);

  app.route('/api/leaves/userid/:userid').all(leavesPolicy.isAllowed)
    .get(leaves.getById);

  app.route('/api/leaves/:leaveId').all(leavesPolicy.isAllowed)
    .get(leaves.read)
    .put(leaves.update)
    .delete(leaves.delete);

  // Checkins Routes By Company
  app.route('/api/leave/company').all(leavesPolicy.isAllowed)
    .get(leaves.listByCompany)
    .post(leaves.create);

  app.route('/api/leave/company/:leaveId').all(leavesPolicy.isAllowed)
    .get(leaves.read)
    .put(leaves.update)
    .delete(leaves.delete);

  app.route('/api/leave/employeeid/:empid').all(leavesPolicy.isAllowed)
    .get(leaves.getByEmployeeId);

  // Finish by binding the Leave middleware
  app.param('leaveId', leaves.leaveByID);
  app.param('userid', leaves.getByUserID);
  app.param('empid', leaves.leaveByEmpID);

};
