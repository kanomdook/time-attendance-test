'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Company Schema
 */
var CompanySchema = new Schema({
  name: {
    type: String,
    default: '',
    unique: 'Company name already exists',
    required: 'Please fill Company name',
    trim: true
  },
  taxid: {
    type: String
  },
  branchs: [{
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
  }],
  brunch: {
    type: String
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
  images: [{
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  }],
  tel: {
    type: String,
  },
  fax: {
    type: String,
  },
  email: {
    type: String,
  },
  website: {
    type: String,
  },
  note: {
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

mongoose.model('Company', CompanySchema);
