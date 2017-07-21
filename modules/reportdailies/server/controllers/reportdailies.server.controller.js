'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Reportdaily = mongoose.model('Reportdaily'),
    Checkin = mongoose.model('Checkin'),
    Company = mongoose.model('Company'),
    Employeeprofile = mongoose.model('Employeeprofile'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash'),
    excel = require('node-excel-export');

/**
 * Create a Reportdaily
 */
exports.create = function (req, res) {
    var reportdaily = new Reportdaily(req.body);
    reportdaily.user = req.user;

    reportdaily.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(reportdaily);
        }
    });
};

/**
 * Show the current Reportdaily
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var reportdaily = req.reportdaily ? req.reportdaily.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    reportdaily.isCurrentUserOwner = req.user && reportdaily.user && reportdaily.user._id.toString() === req.user._id.toString();

    res.jsonp(reportdaily);
};

/**
 * Update a Reportdaily
 */
exports.update = function (req, res) {
    var reportdaily = req.reportdaily;

    reportdaily = _.extend(reportdaily, req.body);

    reportdaily.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(reportdaily);
        }
    });
};

/**
 * Delete an Reportdaily
 */
exports.delete = function (req, res) {
    var reportdaily = req.reportdaily;

    reportdaily.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(reportdaily);
        }
    });
};

/**
 * List of Reportdailies
 */
exports.list = function (req, res) {
    Reportdaily.find().sort('-created').populate('user', 'displayName').exec(function (err, reportdailies) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(reportdailies);
        }
    });
};

/**
 * Reportdaily middleware
 */
exports.reportdailyByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Reportdaily is invalid'
        });
    }

    Reportdaily.findById(id).populate('user', 'displayName').exec(function (err, reportdaily) {
        if (err) {
            return next(err);
        } else if (!reportdaily) {
            return res.status(404).send({
                message: 'No Reportdaily with that identifier has been found'
            });
        }
        req.reportdaily = reportdaily;
        next();
    });
};

exports.reportdailyByDate = function (req, res, next, reportdate) {
    req.date = reportdate;
    next();
    // console.log(newDate + "-" + reportEndDate);
    // รายเดือน 
    // if (newDate.getMonth() > 10) {
    //     reportEndDate = new Date(newDate.getFullYear() + 1 + '-01');
    // } else {
    //     reportEndDate = new Date(newDate).setMonth(new Date(newDate).getMonth() + 1);
    // }
    // { created: { $gte: newDate, $lt: new Date(reportEndDate) } }
    // Company.findById(req.user.company).populate('user', 'displayName').exec(function (err, company) {
    //     if (err) {
    //         return next(err);
    //     } else if (!company) {
    //         return res.status(404).send({
    //             message: 'No Company with that identifier has been found'
    //         });
    //     } else {
    //         Checkin.find({ created: { $gte: newDate, $lt: reportEndDate } }).populate({
    //             path: 'user',
    //             model: 'User',
    //             populate: {
    //                 path: 'employeeprofile',
    //                 model: 'Employeeprofile',
    //                 populate: {
    //                     path: 'company',
    //                     model: 'Company'
    //                 }
    //             }
    //         }).exec(function (err, reportdaily) {
    //             if (err) {
    //                 return next(err);
    //             } else if (!reportdaily) {
    //                 return res.status(404).send({
    //                     message: 'No Reportdaily with that identifier has been found'
    //                 });
    //             } else {
    //                 var checkinByCompany = [];
    //                 var reportDailyData = [];
    //                 if (reportdaily.length > 0) {
    //                     checkinByCompany = reportdaily.filter(function (obj) {
    //                         return obj.user.employeeprofile.company._id.toString() === req.user.company.toString();

    //                     });
    //                 }
    //                 checkinByCompany.forEach(function (i, index) {
    //                     var distance = getDistanceFromLatLonInKm(i.locationIn.lat, i.locationIn.lng, company.address.location.latitude, company.address.location.longitude);
    //                     var distanceout = "";
    //                     if (i.locationOut.lat !== "" || i.locationOut.lng !== "") {
    //                         distanceout = getDistanceFromLatLonInKm(i.locationOut.lat, i.locationOut.lng, company.address.location.latitude, company.address.location.longitude);
    //                         distanceout = distanceout.toFixed(2);
    //                     }
    //                     var workhours = null;
    //                     var timelate = null;
    //                     if (i.dateTimeIn && i.dateTimeOut) {
    //                         workhours = workingHoursBetweenDates(i.dateTimeIn, i.dateTimeOut);
    //                     }
    //                     timelate = workingHoursBetweenDatesLate(i.user.employeeprofile.shiftin, i.dateTimeIn);
    //                     reportDailyData.push({
    //                         employeeid: i.user.employeeprofile.employeeid,
    //                         firstname: i.user.employeeprofile.firstname,
    //                         lastname: i.user.employeeprofile.lastname,
    //                         datetimein: i.dateTimeIn,
    //                         datetimeout: i.dateTimeOut,
    //                         timelate: timelate,
    //                         workinghours: workhours,
    //                         locationIn: {
    //                             lat: i.locationIn.lat,
    //                             lng: i.locationIn.lng
    //                         },
    //                         locationOut: {
    //                             lat: i.locationOut.lat,
    //                             lng: i.locationOut.lng
    //                         },
    //                         type: i.type,
    //                         device: i.user.deviceID,
    //                         distance: distance.toFixed(2),
    //                         distanceout: distanceout,
    //                         remark: {
    //                             timein: i.remark.in,
    //                             timeout: i.remark.out
    //                         },
    //                     });
    //                 });
    //                 returnReportDaily.date = reportdate;
    //                 returnReportDaily.company = company;
    //                 returnReportDaily.data = reportDailyData;
    //                 req._reportdaily = returnReportDaily;
    //                 next();
    //             }
    //         });
    //     }
    // });
};

exports.reportcompany = function (req, res, next) {
    Company.findById(req.user.company).exec(function (err, result) {
        if (err) {
            return res.status(404).send({
                message: 'No Reportdaily Company found'
            });
        } else {
            req.company = result;
            next();
        }
    });
};

exports.getEmployeeProfile = function (req, res, next) {

    Employeeprofile.find({ company: req.user.company }).exec(function (err, result) {
        if (err) {
            return res.status(404).send({
                message: 'No Reportdaily Employeeprofile found'
            });
        } else {
            req.employeeprofiles = result;
            next();
        }
    });
};

exports.reportdata = function (req, res, next) {
    var newDate = new Date(req.date);
    var reportEndDate = null;
    var returnReportDaily = {};
    reportEndDate = new Date(req.date + ' 23:59:59');

    var condition = { dateTimeIn: { $gte: newDate, $lt: new Date(reportEndDate) } };
    if (req.user.roles[0] === 'user') {
        condition = { dateTimeIn: { $gte: newDate, $lt: new Date(reportEndDate) }, user: req.user._id };
    }
    Checkin.find(condition)
        .populate('user')
        .exec(function (err, result) {
            if (err) {
                return res.status(404).send({
                    message: 'No Reportdaily Checkin found'
                });
            } else {

                var datas = [];
                // var chkins = result.filter(function (row) {
                //     if (row.user.company) {
                //         return row.user.company.toString() === req.user.company.toString();
                //     }

                // });
                var chkins = result;
                chkins.forEach(function (element) {

                    var emp = req.employeeprofiles.filter(function (_emp) {
                        //console.log(_emp.email);
                        //console.log(element.email);
                        return _emp.email === element.email;
                    });

                    var data = {
                        number: datas.length + 1,
                        employeeid: emp[0].employeeid,
                        firstName: emp[0].firstname,
                        lastName: emp[0].lastname,
                        user: element.user,
                        email: element.email,
                        datetimein: element.dateTimeIn,
                        datetimeout: element.dateTimeOut,
                        type: element.type,
                        locationOut: element.locationOut,
                        locationIn: element.locationIn,
                        device: element.user.deviceID,
                        timelate: emp[0] ? workingHoursBetweenDatesLate(emp[0].shiftin, element.dateTimeIn) : null,
                        workinghours: workingHoursBetweenDates(element.dateTimeIn, element.dateTimeOut),
                        distance: emp[0] ? getDistanceFromLatLonInKm(element.locationIn.lat, element.locationIn.lng, emp[0].branchs.latitude, emp[0].branchs.longitude) : null,
                        distanceout: emp[0] ? getDistanceFromLatLonInKm(element.locationOut.lat, element.locationOut.lng, emp[0].branchs.latitude, emp[0].branchs.longitude) : null,
                        remark: ''
                    };
                    datas.push(data);
                    // element = element ? element : {};
                    // element.type = 'ios';
                    // element.timelate = 0;//workingHoursBetweenDatesLate(element.dateTimeIn,element.dateTimeIn);
                });
                req.data = datas;


                next();
            }
        });

};

exports.reportdaily = function (req, res, next) {

    res.jsonp({
        date: req.date,
        company: req.company,
        data: req.data,
        user: req.user
    });
};

exports.reportMonthBydate = function (req, res, next, dates) {
    var paramDate = new Date(dates);
    var firstDay = new Date(paramDate.getFullYear(), paramDate.getMonth(), 2);
    //firstDay = firstDay.
    var lastDay = new Date(new Date(paramDate.getFullYear(), paramDate.getMonth() + 1, 0).setHours(23, 59, 59, 999));
    req.reportdate = {
        firstDay: firstDay,
        lastDay: lastDay,
    };
    next();

    // var condition = { created: { $gte: firstDay, $lte: lastDay }, user: { company: req.user.company } };
    // if (req.user.roles[0] === 'user') {
    //     condition = { created: { $gte: firstDay, $lte: lastDay }, user: req.user._id };
    // }

    // Checkin.find(condition).populate('user').exec(function (err, reportmonthly) {
    //     if (err) {
    //         return next(err);
    //     } else if (!reportmonthly) {
    //         return res.status(404).send({
    //             message: 'No Reportmonthly with that identifier has been found'
    //         });
    //     }
    //     req.firstDay = firstDay;
    //     req.lastDay = lastDay;
    //     req.reportbymonth = reportmonthly;
    //     next();
    // });
};

exports.reportmonthByEmployeeid = function (req, res, next, employeeids) {
    req.empid = employeeids;
    Employeeprofile.find({ 'employeeid': req.empid }).exec(function (err, result) {
        if (err) {
            return res.status(404).send({
                message: 'No Reportmonthly with that identifier has been found'
            });
        } else {
            if (result.length > 0) {
                req.empprofile = result[0];
                next();
            } else {
                next();
            }
        }
    });

};

exports.reportmonthFilterByEmployeeid = function (req, res, next) {
    if (req.empid && req.empid !== undefined) {
        req.reportbymonth = req.reportbymonth.filter(function (x) {
            console.log(x.user.email);
            console.log(req.empprofile.email);
            return x.user.email === req.empprofile.email;
        });
        var dataById = [];
        req.reportbymonth.forEach(function (i) {
            // var distance = getDistanceFromLatLonInKm(i.locationIn.lat, i.locationIn.lng, company.address.location.latitude, company.address.location.longitude);
            // var distanceout = "";
            // if (i.locationOut.lat !== "" || i.locationOut.lng !== "") {
            //     distanceout = getDistanceFromLatLonInKm(i.locationOut.lat, i.locationOut.lng, company.address.location.latitude, company.address.location.longitude);
            //     distanceout = distanceout.toFixed(2);
            // }
            // var workhours = null;
            // var timelate = null;
            // if (i.dateTimeIn && i.dateTimeOut) {
            //     workhours = workingHoursBetweenDates(i.dateTimeIn, i.dateTimeOut);
            // }
            // timelate = workingHoursBetweenDatesLate(employeeprofile.shiftin, i.dateTimeIn);
            dataById.push({
                date: i.created,
                day: new Date(i.created).getDay(),
                datetimein: i.dateTimeIn,
                datetimeout: i.dateTimeOut,
                // timelate: timelate || '0:0',
                // workinghours: workhours || '0:0',
                locationIn: {
                    lat: i.locationIn.lat,
                    lng: i.locationIn.lng
                },
                locationOut: {
                    lat: i.locationOut.lat,
                    lng: i.locationOut.lng
                },
                type: i.type,
                device: i.user.deviceID,
                // distance: distance.toFixed(2),
                // distanceout: distanceout || '0',
                remark: {
                    timein: i.remark.in,
                    timeout: i.remark.out
                }
            });
        });
        req.reportbymonth = dataById;
        next();
    } else {
        next();
    }



};

exports.reportmonthly = function (req, res, next) {
    // req.reportdate = date;
    var condition = { created: { $gte: req.reportdate.firstDay, $lte: req.reportdate.lastDay } };
    if (req.user.roles[0] === 'user') {
        condition = { created: { $gte: req.reportdate.firstDay, $lte: req.reportdate.lastDay }, user: req.user._id };
    }
    Checkin.find(condition)
        .populate('user')
        .exec(function (err, result) {
            if (err) {
                return res.status(404).send({
                    message: 'No Reportdaily Checkin found'
                });
            } else {

                req.reportbymonth = result.filter(function (x) {
                    // console.log('=====================Company');
                    // console.log(req.user.company);
                    // console.log(x.user.company);
                    return x.user.company.toString() === req.user.company.toString();
                    //return true;
                });


                next();

            }
        });

};

exports.sendreportmonthly = function (req, res) {
    res.jsonp({
        firstday: req.firstDay || '',
        lastday: req.lastDay || '',
        data: req.reportbymonth || [],
        date: req.reportdate || '',
        employeeprofile: req.empprofile || '',
        company: req.company || ''
    });
};



exports.reportmonthlyByDateAndEmployeeId = function (req, res, next, employeeid) {
    req.employeeid = employeeid;
    next();
};

exports.exportByDate = function (req, res, next) {
    // console.dir(req._reportdaily);
    req.date = req.date.split(':')[1];
    var date = req.date.split('-')[2] + '/' + req.date.split('-')[1] + '/' + req.date.split('-')[0];
    var styles = {
        headerDark: {
            fill: {
                fgColor: {
                    rgb: 'FFFFFFFF'
                }
            },
            font: {
                color: {
                    rgb: 'FF000000'
                },
                sz: 12,
                bold: false,
                underline: false
            }
        },
        default: {
            fill: {
                fgColor: {
                    rgb: 'FFC0C0C0'
                }
            },
            font: {
                color: {
                    rgb: 'FF000000'
                },
                sz: 12,
                bold: false,
                underline: false
            }
        }
    };

    var heading = [
        [{ value: 'รายงานการมาทำงานของพนักงาน (รายวัน)', style: styles.headerDark }], // <-- It can be only values 
        ['วันที่ ' + date + '']
    ];

    var specification = {
        number: { // <- the key should match the actual data key 
            displayName: 'ลำดับ', // <- Here you specify the column header 
            headerStyle: styles.default, // <- Header style 
            width: 40 // <- width in pixels 
        },
        employeeid: { // <- the key should match the actual data key 
            displayName: 'รหัสพนักงาน', // <- Here you specify the column header 
            headerStyle: styles.default, // <- Header style 
            width: 80 // <- width in pixels 
        },
        firstname: { // <- the key should match the actual data key 
            displayName: 'ชื่อ', // <- Here you specify the column header 
            headerStyle: styles.default, // <- Header style 
            width: 120 // <- width in pixels 
        },
        lastname: { // <- the key should match the actual data key 
            displayName: 'นามสกุล', // <- Here you specify the column header 
            headerStyle: styles.default, // <- Header style 
            width: 120 // <- width in pixels 
        },
        startdate: { // <- the key should match the actual data key 
            displayName: 'เวลาเข้า', // <- Here you specify the column header 
            headerStyle: styles.default, // <- Header style 
            width: 80 // <- width in pixels 
        },
        enddate: { // <- the key should match the actual data key 
            displayName: 'เวลาออก', // <- Here you specify the column header 
            headerStyle: styles.default, // <- Header style 
            width: 80 // <- width in pixels 
        },
        latitudein: { // <- the key should match the actual data key 
            displayName: 'ละติจูดเข้า', // <- Here you specify the column header 
            headerStyle: styles.default, // <- Header style 
            width: 80 // <- width in pixels 
        },
        longitudein: { // <- the key should match the actual data key 
            displayName: 'ลองติจูดเข้า', // <- Here you specify the column header 
            headerStyle: styles.default, // <- Header style 
            width: 80 // <- width in pixels 
        },
        latitudeout: { // <- the key should match the actual data key 
            displayName: 'ละติจูดออก', // <- Here you specify the column header 
            headerStyle: styles.default, // <- Header style 
            width: 80 // <- width in pixels 
        },
        longitudeout: { // <- the key should match the actual data key 
            displayName: 'ลองติจูดออก', // <- Here you specify the column header 
            headerStyle: styles.default, // <- Header style 
            width: 80 // <- width in pixels 
        },
        type: { // <- the key should match the actual data key 
            displayName: 'ประเภท', // <- Here you specify the column header 
            headerStyle: styles.default, // <- Header style 
            width: 100 // <- width in pixels 
        },
        device: { // <- the key should match the actual data key 
            displayName: 'เครื่อง', // <- Here you specify the column header 
            headerStyle: styles.default, // <- Header style 
            width: 100 // <- width in pixels 
        },
        distance: { // <- the key should match the actual data key 
            displayName: 'ระยะห่าง (กม.)', // <- Here you specify the column header 
            headerStyle: styles.default, // <- Header style 
            width: 100 // <- width in pixels 
        },
        timelate: { // <- the key should match the actual data key 
            displayName: 'สาย (ชม.นาที)', // <- Here you specify the column header 
            headerStyle: styles.default, // <- Header style 
            width: 100 // <- width in pixels 
        },
        workinghours: { // <- the key should match the actual data key 
            displayName: 'ชั่วโมงทำงาน', // <- Here you specify the column header 
            headerStyle: styles.default, // <- Header style 
            width: 100 // <- width in pixels 
        },
        remarkin: { // <- the key should match the actual data key 
            displayName: 'หมายเหตุ(เข้างาน)', // <- Here you specify the column header 
            headerStyle: styles.default, // <- Header style 
            width: 120 // <- width in pixels 
        },
        remarkout: { // <- the key should match the actual data key 
            displayName: 'หมายเหตุ(ออกงาน)', // <- Here you specify the column header 
            headerStyle: styles.default, // <- Header style 
            width: 120 // <- width in pixels 
        },
    };

    var dataset = [];

    req.data.forEach(function (i, index) {
        var startdate = new Date(i.datetimein);
        var enddate = new Date(i.datetimeout);
        var startdateText = (startdate.getUTCHours() + 7) + ':' + startdate.getUTCMinutes() + ':' + startdate.getUTCSeconds();
        var enddateText = '';
        if (i.datetimeout) {
            enddateText = (enddate.getUTCHours() + 7) + ':' + enddate.getUTCMinutes() + ':' + enddate.getUTCSeconds();
        }
        dataset.push({
            number: (index + 1),
            employeeid: i.employeeid,
            firstname: i.firstName,
            lastname: i.lastName,
            startdate: startdateText,
            enddate: enddateText,
            latitudein: i.locationIn.lat,
            longitudein: i.locationIn.lng,
            latitudeout: i.locationOut.lat,
            longitudeout: i.locationOut.lng,
            type: i.type,
            device: i.device,
            distance: i.distance,
            timelate: i.timelate,
            workinghours: i.workinghours,
            remarkin: i.remark.timein,
            remarkout: i.remark.timeout
        });
    });

    var merges = [
        { start: { row: 1, column: 1 }, end: { row: 1, column: 17 } },
        { start: { row: 2, column: 1 }, end: { row: 2, column: 17 } }

    ];

    var report = excel.buildExport(
        [
            {
                name: 'Report', // <- Specify sheet name (optional) 
                heading: heading, // <- Raw heading array (optional) 
                merges: merges, // <- Merge cell ranges 
                specification: specification, // <- Report specification 
                data: dataset // <-- Report data 
            }
        ]
    );

    req.export = report;
    next();
};

exports.exportExcel = function (req, res, next) {
    res.attachment('reportdaily' + req.date + '.xlsx'); // This is sails.js specific (in general you need to set headers) 
    return res.send(req.export);
};

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
// get hours
function workingHoursBetweenDates(startDateTime, endDateTime) {
    var start = new Date(startDateTime).getHours() + ":" + new Date(startDateTime).getMinutes();
    var end = new Date(endDateTime).getHours() + ":" + new Date(endDateTime).getMinutes();
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0) {
        hours = hours + 24;
    }

    return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
}

function workingHoursBetweenDatesLate(startDateTime, endDateTime) {
    var start = new Date(startDateTime).getHours() + ":" + new Date(startDateTime).getMinutes();
    var end = new Date(endDateTime).getHours() + ":" + new Date(endDateTime).getMinutes();
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    console.log(parseInt(start[0]) + " : " + parseInt(end[0]));
    if (parseInt(start[0]) <= parseInt(end[0])) {
        // If using time pickers with 24 hours format, add the below line get exact hours
        if (hours < 0) {
            hours = hours + 24;
        }

        return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
    } else {
        return "00:00";
    }
}
