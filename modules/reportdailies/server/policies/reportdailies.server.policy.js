'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Reportdailies Permissions
 */
exports.invokeRolesPolicies = function() {
    acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/reportdailies',
            permissions: '*'
        }, {
            resources: '/api/reportdailies/:reportdailyId',
            permissions: '*'
        }, {
            resources: '/api/reportdaily/:reportdate',
            permissions: '*'
        }, {
            resources: '/api/reportdaily/export/excel/:exportdate',
            permissions: '*'
        }, {
            resources: '/api/reportdaily/month/:dates/:employeeids',
            permissions: '*'
        }]
    }, {
        roles: ['user'],
        allows: [{
            resources: '/api/reportdailies',
            permissions: ['get', 'post']
        }, {
            resources: '/api/reportdailies/:reportdailyId',
            permissions: ['get']
        }, {
            resources: '/api/reportdaily/:reportdate',
            permissions: ['get']
        }, {
            resources: '/api/reportdaily/export/excel/:exportdate',
            permissions: ['*']
        }, {
            resources: '/api/reportdaily/month/:dates/:employeeids',
            permissions: '*'
        }]
    }, {
        roles: ['guest'],
        allows: [{
            resources: '/api/reportdailies',
            permissions: ['get']
        }, {
            resources: '/api/reportdailies/:reportdailyId',
            permissions: ['get']
        }, {
            resources: '/api/reportdaily/month/:dates/:employeeids',
            permissions: '*'
        }]
    }]);
};

/**
 * Check If Reportdailies Policy Allows
 */
exports.isAllowed = function(req, res, next) {
    var roles = (req.user) ? req.user.roles : ['guest'];

    // If an Reportdaily is being processed and the current user created it then allow any manipulation
    if (req.reportdaily && req.user && req.reportdaily.user && req.reportdaily.user.id === req.user.id) {
        return next();
    }

    // Check for user roles
    acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function(err, isAllowed) {
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
