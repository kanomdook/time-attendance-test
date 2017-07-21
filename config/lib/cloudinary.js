'use strict';
var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'hxombwedd',
    api_key: '886366883412427',
    api_secret: 'Bp61sMBHEs49uxycX70XgwM3vTA'
});

module.exports.cloudinary = cloudinary;