'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Employeeprofiles Permissions
 */
exports.invokeRolesPolicies = function() {
    acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/employeeprofiles',
            permissions: '*'
        }, {
            resources: '/api/employeeprofiles/:employeeprofileId',
            permissions: '*'
        }, {
            resources: '/api/employee/company',
            permissions: '*'
        }, {
            resources: '/api/employee/company/:employeeprofileId',
            permissions: '*'
        }, {
            resources: '/api/excel',
            permissions: ['get']
        }]
    }, {
        roles: ['user'],
        allows: [{
            resources: '/api/employeeprofiles',
            permissions: ['get', 'post']
        }, {
            resources: '/api/employeeprofiles/:employeeprofileId',
            permissions: ['get']
        }, {
            resources: '/api/employee/company',
            permissions: ['get', 'post']
        }, {
            resources: '/api/employee/company/:employeeprofileId',
            permissions: ['get']
        }, {
            resources: '/api/excel',
            permissions: ['get']
        }]
    }, {
        roles: ['guest'],
        allows: [{
            resources: '/api/employeeprofiles',
            permissions: ['get']
        }, {
            resources: '/api/employeeprofiles/:employeeprofileId',
            permissions: ['get']
        }, {
            resources: '/api/employee/company',
            permissions: ['get']
        }, {
            resources: '/api/employee/company/:employeeprofileId',
            permissions: ['get']
        }, {
            resources: '/api/excel',
            permissions: ['get']
        }]
    }]);
};

/**
 * Check If Employeeprofiles Policy Allows
 */
exports.isAllowed = function(req, res, next) {
    var roles = (req.user) ? req.user.roles : ['guest'];

    // If an Employeeprofile is being processed and the current user created it then allow any manipulation
    if (req.employeeprofile && req.user && req.employeeprofile.user && req.employeeprofile.user.id === req.user.id) {
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
