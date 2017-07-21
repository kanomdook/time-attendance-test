'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Reportdaily Schema
 */
var ReportdailySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Reportdaily name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Reportdaily', ReportdailySchema);
