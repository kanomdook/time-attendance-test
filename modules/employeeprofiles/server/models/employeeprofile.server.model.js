'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Employeeprofile Schema
 */
var EmployeeprofileSchema = new Schema({
    email: {
        type: String,
        required: 'Please fill email',
        unique: 'Email already exists'
    },
    employeeid:{
        type: String,
        required: 'Please fill employeeid',
        unique: 'employeeid already exists'
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    displayname: {
        type: String,
    },
    company: {
        type: Schema.ObjectId,
        ref: 'Company'
    },
    branchs: {
    branch: {
      type: String,
    },
    address: {
      type: String,
    },
    subdistrict: {
      type: String,
    },
    district: {
      type: String,
    },
    province: {
      type: String,
    },
    postcode: {
      type: String,
    },
    country: {
      type: String,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    }
  },
    address: {
        address: {
            type: String,
        },
        district: {
            type: String,
        },
        subdistrict: {
            type: String,
        },
        postcode: {
            type: String,
        },
        province: {
            type: String,
        },
        country: {
            cca2: {
                type: String
            },
            cca3: {
                type: String
            },
            en: {
                common: {
                    type: String
                },
                official: {
                    type: String
                }
            },
            th: {
                type: String
            },
            currency: {
                type: String
            }
        },
        location: {
            latitude: {
                type: String
            },
            longitude: {
                type: String
            }
        }
    },
    shiftin: {
        type: Date
    },
    shiftout: {
        type: Date
    },
    leader: {
        type: Schema.ObjectId,
        ref: 'Employeeprofile'
    },
    jobTitle: {
        type: String,
    },
    line: {
        type: String,
    },
    image: {
        type: String,
    },
    tel: {
        type: String,
    },
    facebook: {
        type: String,
    },
    deviceId: {
        type: String,
    },
    platform: {
        type: String,
    },
    mobile: {
        type: String,
    },
    departmentCode: {
        type: String,
    },
    locationCode: {
        type: String,
    },
    positionByJob: {
        type: String,
    },
    fingerscannerid: {
        type: String,
    },
    fingerid: {
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

mongoose.model('Employeeprofile', EmployeeprofileSchema);
