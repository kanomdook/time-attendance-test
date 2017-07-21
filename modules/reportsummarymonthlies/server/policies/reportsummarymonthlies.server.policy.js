'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Reportsummarymonthlies Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/reportsummarymonthlies',
      permissions: '*'
    }, {
      resources: '/api/reportsummarymonthlies/:reportsummarymonthlyId',
      permissions: '*'
    },{
      resources: '/api/reportsummarymonthly/:startdate/:enddate',
      permissions: '*'
    },{
      resources: '/api/reportsummarymonthly/export/excel/:startdate/:enddate',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/reportsummarymonthlies',
      permissions: ['get', 'post']
    }, {
      resources: '/api/reportsummarymonthlies/:reportsummarymonthlyId',
      permissions: ['get']
    },{
      resources: '/api/reportsummarymonthly/:companyId/:startdate/:enddate',
      permissions: '*'
    },{
      resources: '/api/reportsummarymonthly/export/excel/:companyId/:startdate/:enddate',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/reportsummarymonthlies',
      permissions: ['get']
    }, {
      resources: '/api/reportsummarymonthlies/:reportsummarymonthlyId',
      permissions: ['get']
    },{
      resources: '/api/reportsummarymonthly/:startdate/:enddate',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Reportsummarymonthlies Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Reportsummarymonthly is being processed and the current user created it then allow any manipulation
  if (req.reportsummarymonthly && req.user && req.reportsummarymonthly.user && req.reportsummarymonthly.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
