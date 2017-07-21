'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Reportsummarymonthly Schema
 */
var ReportsummarymonthlySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Reportsummarymonthly name',
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

mongoose.model('Reportsummarymonthly', ReportsummarymonthlySchema);
