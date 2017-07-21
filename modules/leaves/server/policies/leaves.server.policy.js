'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Leaves Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/leaves',
      permissions: '*'
    }, {
      resources: '/api/leaves/:leaveId',
      permissions: '*'
    }, {
      resources: '/api/leaves/userid/:userid',
      permissions: '*'
    }, {
      resources: '/api/leave/company',
      permissions: '*'
    }, {
      resources: '/api/leave/company/:leaveId',
      permissions: '*'
    }, {
      resources: '/api/leave/employeeid/:empid',
      permissions: '*'
    },
    {
      resources: '/api/getLeaveByLeaveTypeAndDate',
      permissions: ['*']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/leaves',
      permissions: '*'
    }, {
      resources: '/api/leaves/:leaveId',
      permissions: '*'
    }, {
      resources: '/api/leaves/userid/:userid',
      permissions: '*'
    }, {
      resources: '/api/leave/company',
      permissions: ['get', 'post']
    }, {
      resources: '/api/leave/company/:leaveId',
      permissions: ['get']
    }, {
      resources: '/api/leave/employeeid/:empid',
      permissions: ['get']
    },
    {
      resources: '/api/getLeaveByLeaveTypeAndDate',
      permissions: ['*']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/leaves',
      permissions: ['get']
    }, {
      resources: '/api/leaves/:leaveId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Leaves Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Leave is being processed and the current user created it then allow any manipulation
  if (req.leave && req.user && req.leave.user && req.leave.user.id === req.user.id) {
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
