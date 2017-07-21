'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Checkin Schema
 */
var CheckinSchema = new Schema({
  email: {
    type: String,
    required: 'Please fill email',
  },
  dateTimeIn: Date,
  dateTimeOut: Date,
  locationIn: {
    lat: {
      type: String,
    },
    lng: {
      type: String,
    }
  },
  locationOut: {
    lat: {
      type: String,
    },
    lng: {
      type: String,
    }
  },
  status: {
    type: String,
  },
  description: {
    type: String,
  },
  img: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  deviceid: {
    type: String
  },
  remark: {
    in: String,
    out: String
  },
  type: {
    type: String,
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

mongoose.model('Checkin', CheckinSchema);
