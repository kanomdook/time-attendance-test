'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  cloudinary = require(path.resolve('./config/lib/cloudinary')).cloudinary;
/**
 * Create a Company
 */
exports.create = function (req, res) {
  var company = new Company(req.body);
  company.user = req.user;

  company.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(company);
    }
  });
};

/**
 * Show the current Company
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var company = req.company ? req.company.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  company.isCurrentUserOwner = req.user && company.user && company.user._id.toString() === req.user._id.toString();

  res.jsonp(company);
};

/**
 * Update a Company
 */
exports.update = function (req, res) {
  var company = req.company;

  company = _.extend(company, req.body);

  company.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(company);
    }
  });
};

/**
 * Delete an Company
 */
exports.delete = function (req, res) {
  var company = req.company;

  company.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(company);
    }
  });
};

/**
 * List of Companies
 */
exports.list = function (req, res) {
  Company.find().sort('-created').populate('user', 'displayName').exec(function (err, companies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(companies);
    }
  });
};

/**
 * Company middleware
 */
exports.companyByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Company is invalid'
    });
  }

  Company.findById(id).populate('user', 'displayName').exec(function (err, company) {
    if (err) {
      return next(err);
    } else if (!company) {
      return res.status(404).send({
        message: 'No Company with that identifier has been found'
      });
    }
    req.company = company;
    next();
  });
};

exports.changeCompaniesPicture = function (req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.productUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;
  if (user) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        var cloudImageURL = './public/' + req.file.filename;
        cloudinary.uploader.upload(cloudImageURL, function (result) {
          // console.dir(result);
          var image = {
            public_id: result.public_id,
            url: result.url
          };
          res.json({ status: '000', message: 'success', image: image });
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};
//  get list by company
exports.listByCompany = function (req, res) {
  Company.find({ _id: req.user.company }).sort('-created').populate('user', 'displayName').exec(function (err, company) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(company);
    }
  });
};