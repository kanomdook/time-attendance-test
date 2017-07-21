'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Reportmonthly Schema
 */
var ReportmonthlySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Reportmonthly name',
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

mongoose.model('Reportmonthly', ReportmonthlySchema);
