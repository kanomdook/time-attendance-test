'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Leave = mongoose.model('Leave'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Leave
 */
exports.create = function (req, res) {
    var leave = new Leave(req.body);
    leave.user = req.user;

    leave.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(leave);
        }
    });
};

/**
 * Show the current Leave
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var leave = req.leave ? req.leave.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    leave.isCurrentUserOwner = req.user && leave.user && leave.user._id.toString() === req.user._id.toString();

    res.jsonp(leave);
};

/**
 * Update a Leave
 */
exports.update = function (req, res) {
    var leave = req.leave;

    leave = _.extend(leave, req.body);

    leave.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(leave);
        }
    });
};

/**
 * Delete an Leave
 */
exports.delete = function (req, res) {
    var leave = req.leave;

    leave.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(leave);
        }
    });
};

/**
 * List of Leaves
 */
exports.list = function (req, res) {
    Leave.find().sort('-created').populate('user', 'displayName').exec(function (err, leaves) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(leaves);
        }
    });
};

/**
 * Leave middleware
 */
exports.leaveByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Leave is invalid'
        });
    }

    Leave.findById(id).populate('user').exec(function (err, leave) {
        if (err) {
            return next(err);
        } else if (!leave) {
            return res.status(404).send({
                message: 'No Leave with that identifier has been found'
            });
        }
        req.leave = leave;
        next();
    });
};

exports.getByUserID = function (req, res, next, id) {

    Leave.find({ user: id }).populate({ path: 'user', select: 'displayName profileImageURL' }).exec(function (err, leave) {
        req.leaveByUserID = leave;
        next();
    });

};

exports.getById = function (req, res) {
    res.jsonp(req.leaveByUserID);
};
//  get list by company
exports.listByCompany = function (req, res) {
    Leave.find({'leaveStatus': { $ne: 'Draft' }}).sort('-created').populate({
        path: 'user',
        model: 'User',
        populate: {
            path: 'employeeprofile',
            model: 'Employeeprofile',
            populate: {
                path: 'company',
                model: 'Company'
            }
        }
    }).exec(function (err, leave) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var leaveByCompany = [];
            if (leave.length > 0) {
                leaveByCompany = leave.filter(function (obj) {
                    return obj.user.employeeprofile.company._id.toString() === req.user.company.toString();
                });
            }
            res.jsonp(leaveByCompany);
        }
    });
};

exports.leaveByEmpID = function (req, res, next, empid) {
    Leave.find().sort('-created').populate({
        path: 'user',
        model: 'User',
        populate: {
            path: 'employeeprofile',
            model: 'Employeeprofile'
        }
    }).exec(function (err, leave) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var leaveByEmployee = [];
            if (leave.length > 0) {
                leaveByEmployee = leave.filter(function (obj) {
                    return obj.user.employeeprofile._id.toString() === empid.toString();
                });
            }
            req.leaveByEmployee = leaveByEmployee;
            next();
        }
    });
};

exports.getLeaveByLeaveTypeAndDate = function (req, res) {
    if (req.body.leaveType && req.body.startDate && req.body.endDate) {
        Leave.find({ 'leaveType': req.body.leaveType, 'leaveStatus': { $ne: 'Draft' }, created: { $gte: new Date(req.body.startDate), $lt: new Date(req.body.endDate) } })
            .sort('-created')
            .populate({
                path: 'user',
                model: 'User',
                populate: {
                    path: 'employeeprofile',
                    model: 'Employeeprofile',
                    populate: {
                        path: 'company',
                        model: 'Company'
                    }
                }
            }).exec(function (err, leave) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    var leaveByCompany = [];
                    if (leave.length > 0) {
                        leaveByCompany = leave.filter(function (obj) {
                            return obj.user.employeeprofile.company._id.toString() === req.user.company.toString();
                        });
                    }
                    res.jsonp(leaveByCompany);
                }
            });
    }
};

exports.getByEmployeeId = function (req, res) {
    res.jsonp(req.leaveByEmployee);
};