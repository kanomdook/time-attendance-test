'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Employeeprofile = mongoose.model('Employeeprofile'),
    Company = mongoose.model('Company'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Employeeprofile
 */
exports.create = function(req, res) {
    var employeeprofile = new Employeeprofile(req.body);
    employeeprofile.user = req.user;
    employeeprofile.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {

            res.jsonp(employeeprofile);
        }
    });
};

/**
 * Show the current Employeeprofile
 */
exports.read = function(req, res) {
    // convert mongoose document to JSON
    var employeeprofile = req.employeeprofile ? req.employeeprofile.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    employeeprofile.isCurrentUserOwner = req.user && employeeprofile.user && employeeprofile.user._id.toString() === req.user._id.toString();

    res.jsonp(employeeprofile);
};

/**
 * Update a Employeeprofile
 */
exports.update = function(req, res) {
    var employeeprofile = req.employeeprofile;

    employeeprofile = _.extend(employeeprofile, req.body);

    employeeprofile.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(employeeprofile);
        }
    });
};

/**
 * Delete an Employeeprofile
 */
exports.delete = function(req, res) {
    var employeeprofile = req.employeeprofile;

    employeeprofile.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(employeeprofile);
        }
    });
};

/**
 * List of Employeeprofiles
 */
exports.list = function(req, res) {
    Employeeprofile.find().sort('-created').populate('user', 'displayName').populate('company').exec(function(err, employeeprofiles) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(employeeprofiles);
        }
    });
};

/**
 * Employeeprofile middleware
 */
exports.employeeprofileByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Employeeprofile is invalid'
        });
    }

    Employeeprofile.findById(id).populate('user', 'displayName').populate('company').exec(function(err, employeeprofile) {
        if (err) {
            return next(err);
        } else if (!employeeprofile) {
            return res.status(404).send({
                message: 'No Employeeprofile with that identifier has been found'
            });
        }
        req.employeeprofile = employeeprofile;
        next();
    });
};

exports.email = function(req, res, next, email) {
    Employeeprofile.find().populate('user', 'displayName').populate('company').exec(function(err, employeeprofile) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var employees = [];
            for (var i = 0; i < employeeprofile.length; i++) {
                // console.log(promotions[i].product._id + ':' + _id);
                if (employeeprofile[i].email.toString() === email.toString()) {
                    // console.log(promotions[i]);

                    employees.push(employeeprofile[i]);

                }
            }
            //console.log(promos);
            req.employees = employees;
            next();
        }
    });
};

exports.checkemail = function(req, res) {
    var employees = req.employees ? req.employees : [];
    var firstname = '';
    var lastname = '';
    employees.forEach(function(emp) {
        firstname = emp.firstName;
        lastname = emp.lastName;
    });

    res.jsonp({ employees: employees, firstname: firstname, lastname: lastname });

};
//  get list by company
exports.listByCompany = function(req, res) {
    Employeeprofile.find({ company: req.user.company }).sort('-created').populate('user', 'displayName').populate('company').exec(function(err, employeeprofiles) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        employeeprofiles.forEach(function(i, index) {
            i.displayname = i.firstname + ' ' + i.lastname;
        });
        res.jsonp(employeeprofiles);
    });
};
