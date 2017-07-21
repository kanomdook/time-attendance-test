'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Checkin = mongoose.model('Checkin'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Checkin
 */
exports.create = function (req, res) {
    var checkin = new Checkin(req.body);
    checkin.user = req.user;

    checkin.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(checkin);
        }
    });
};

/**
 * Show the current Checkin
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var checkin = req.checkin ? req.checkin.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    checkin.isCurrentUserOwner = req.user && checkin.user && checkin.user._id.toString() === req.user._id.toString();

    res.jsonp(checkin);
};

/**
 * Update a Checkin
 */
exports.update = function (req, res) {
    var checkin = req.checkin;

    checkin = _.extend(checkin, req.body);

    checkin.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(checkin);
        }
    });
};

/**
 * Delete an Checkin
 */
exports.delete = function (req, res) {
    var checkin = req.checkin;

    checkin.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(checkin);
        }
    });
};

/**
 * List of Checkins
 */
exports.list = function (req, res) {
    Checkin.find().sort('-created').populate({ path: 'user', select: 'displayName profileImageURL' }).exec(function (err, checkins) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(checkins);
        }
    });
};

/**
 * Checkin middleware
 */
exports.checkinByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Checkin is invalid'
        });
    }

    Checkin.findById(id).populate({ path: 'user', select: 'displayName profileImageURL' }).exec(function (err, checkin) {
        if (err) {
            return next(err);
        } else if (!checkin) {
            return res.status(404).send({
                message: 'No Checkin with that identifier has been found'
            });
        }
        req.checkin = checkin;
        next();
    });
};

exports.userById = function (req, res, next, userid) {
    var status = '';
    var data = null;
    // console.log(userid);
    Checkin.find({ user: userid }).populate({ path: 'user', select: 'displayName profileImageURL' }).exec(function (err, users) {
        if (err) {
            return next(err);
        } else if (!users) {
            return res.status(404).send({
                message: 'No Checkin with that identifier has been found'
            });
        }
        var all = [];
        for (var i = 0; i < users.length; i++) {
            if (users[i].user) {
                // console.log(users[i].user._id.toString() === userid.toString());
                if (users[i].user._id.toString() === userid.toString()) {
                    if (users[i].dateTimeIn) {
                        var dateObj = new Date();
                        var month = dateObj.getUTCMonth() + 1; //months from 1-12
                        var day = dateObj.getUTCDate();
                        var year = dateObj.getUTCFullYear();
                        var monthCheck = users[i].dateTimeIn.getUTCMonth() + 1;
                        var dayCheck = users[i].dateTimeIn.getUTCDate();
                        var yearCheck = users[i].dateTimeIn.getUTCFullYear();
                        // newdate = year + "/" + month + "/" + day;
                        if (day === dayCheck && month === monthCheck && year === yearCheck) {

                            if (users[i].dateTimeOut) {
                                data = users[i];
                                status = 'checkined today';
                            } else {
                                data = users[i];
                                status = 'checkin only';
                            }
                        } else {
                            status = 'Not checkin';
                        }
                    } else {
                        status = 'Not checkin';
                    }
                    // all.push(users[i]);
                }
            }
        }

        req.status = { status: status, data: data };
        next();
    });
};

exports.userids = function (req, res) {
    res.jsonp(req.status);
};

exports.getByUserID = function (req, res, next, id) {

    var reqYearMonth = req.yearMonth;
    var checkinData = [];
    Checkin.find({ user: id }).populate({ path: 'user', select: 'displayName profileImageURL' }).exec(function (err, checkin) {
        if (reqYearMonth && reqYearMonth !== "All") {
            for (var i = 0; i < checkin.length; i++) {
                var checkinDate = new Date(checkin[i].created);
                var checkinYear = checkinDate.getUTCFullYear();
                var checkinMonth = checkinDate.getUTCMonth() + 1;
                var checkinYearMonth = checkinYear + "" + checkinMonth; // 20171

                // console.log(checkinYearMonth);
                // console.log(reqYearMonth);

                if (checkinYearMonth === reqYearMonth) {
                    checkinData.push(checkin[i]);
                }
            }
            req.checkinByID = checkinData;
        } else {
            req.checkinByID = checkin;
        }
        next();
    });

};

exports.getById = function (req, res) {
    res.jsonp(req.checkinByID);
};
//  get list by company
exports.listByCompany = function (req, res) {
    var d = new Date(),
        hour = d.getHours(),
        min = d.getMinutes(),
        month = d.getMonth(),
        year = d.getFullYear(),
        sec = d.getSeconds(),
        day = d.getDate();
    Checkin.find({ 'created': { $gt: new Date(year,month,day), $lt: new Date(year,month,day + 1) } }).sort('-created').populate({
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
    }).exec(function (err, checkin) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var checkinByCompany = [];
            if (checkin.length > 0) {
                checkinByCompany = checkin.filter(function (obj) {
                    return obj.user.employeeprofile.company._id.toString() === req.user.company.toString();

                });
            }
            res.jsonp(checkinByCompany);
        }
    });
};

exports.getByEmpID = function (req, res, next, empid) {

    var reqYearMonth = req.ym;
    var checkinData = [];
    Checkin.find().sort('-created').populate({
        path: 'user',
        model: 'User',
        populate: {
            path: 'employeeprofile',
            model: 'Employeeprofile'
        }
    }).exec(function (err, checkin) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var checkinByCompany = [];
            if (checkin.length > 0) {
                checkinByCompany = checkin.filter(function (obj) {
                    return obj.user.employeeprofile._id.toString() === empid;

                });
            }
            for (var i = 0; i < checkinByCompany.length; i++) {
                var checkinDate = new Date(checkinByCompany[i].created);
                var checkinYear = checkinDate.getUTCFullYear();
                var checkinMonth = checkinDate.getUTCMonth() + 1;
                var checkinYearMonth = checkinYear + "" + checkinMonth; // 20171

                // console.log(checkinYearMonth);
                // console.log(reqYearMonth);

                if (checkinYearMonth === reqYearMonth) {
                    checkinData.push(checkinByCompany[i]);
                }
            }
            req.checkinByEmpId = checkinData;
            next();
        }
    });

};

exports.getByEmployeeId = function (req, res) {
    res.jsonp(req.checkinByEmpId);
};