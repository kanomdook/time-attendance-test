'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Checkins Permissions
 */
exports.invokeRolesPolicies = function () {
    acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/checkins',
            permissions: '*'
        }, {
            resources: '/api/checkins/:checkinId',
            permissions: '*'
        }, {
            resources: '/api/checkin/company',
            permissions: '*'
        }, {
            resources: '/api/checkin/company/:checkinId',
            permissions: '*'
        }, {
            resources: '/api/checkins/employeeid/:ym/:empid',
            permissions: '*'
        }]
    }, {
        roles: ['user'],
        allows: [
            {
                resources: '/api/checkins',
                permissions: ['get', 'post']
            },
            {
                resources: '/api/checkins/:checkinId',
                permissions: ['get', 'post']
            }, {
                resources: '/api/checkin/company',
                permissions: ['get', 'post']
            }, {
                resources: '/api/checkin/company/:checkinId',
                permissions: ['get', 'post']
            }, {
                resources: '/api/checkins/employeeid/:ym/:empid',
                permissions: ['get']
            }]
    }, {
        roles: ['guest'],
        allows: [{
            resources: '/api/checkins',
            permissions: ['get']
        }, {
            resources: '/api/checkins/:checkinId',
            permissions: ['get']
        }]
    }]);
};

/**
 * Check If Checkins Policy Allows
 */
exports.isAllowed = function (req, res, next) {
    var roles = (req.user) ? req.user.roles : ['guest'];

    // If an Checkin is being processed and the current user created it then allow any manipulation
    if (req.checkin && req.user && req.checkin.user && req.checkin.user.id === req.user.id) {
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