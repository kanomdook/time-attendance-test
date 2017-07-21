'use strict';

/**
 * Module dependencies
 */
var reportdailiesPolicy = require('../policies/reportdailies.server.policy'),
    reportdailies = require('../controllers/reportdailies.server.controller');

module.exports = function(app) {
    // Reportdailies Routes
    app.route('/api/reportdailies').all(reportdailiesPolicy.isAllowed)
        .get(reportdailies.list)
        .post(reportdailies.create);

    app.route('/api/reportdailies/:reportdailyId').all(reportdailiesPolicy.isAllowed)
        .get(reportdailies.read)
        .put(reportdailies.update)
        .delete(reportdailies.delete);

    // Reportdailies Routes
    app.route('/api/reportdaily/:reportdate')//.all(reportdailiesPolicy.isAllowed)
        .get(reportdailies.reportcompany,reportdailies.getEmployeeProfile,reportdailies.reportdata,reportdailies.reportdaily);

    app.route('/api/reportdaily/export/excel/:exportdate')//.all(reportdailiesPolicy.isAllowed)
        // .get(reportdailies.exportByDate, reportdailies.exportExcel);
        .get(reportdailies.reportcompany,reportdailies.getEmployeeProfile,reportdailies.reportdata,reportdailies.exportByDate,reportdailies.exportExcel);

   // Reportdailies Routes
   ///api/reportmonthly/:date/:employeeid
    app.route('/api/reportdaily/month/:dates/:employeeids')//.all(reportmonthliesPolicy.isAllowed)
        .get(reportdailies.reportcompany,reportdailies.reportmonthly, reportdailies.reportmonthFilterByEmployeeid,reportdailies.sendreportmonthly);

    // app.route('/api/reportmonth/export/excel/:date/:employeeid')//.all(reportmonthliesPolicy.isAllowed)
    //     .get(reportmonthlies.reportmonthly, reportmonthlies.exportByMonth, reportmonthlies.exportExcel);

        
    // Finish by binding the Reportdaily middleware
    app.param('reportdate', reportdailies.reportdailyByDate);

    app.param('exportdate', reportdailies.reportdailyByDate);

    app.param('reportdailyId', reportdailies.reportdailyByID);

    //////////////////////month///////////////////////////

 
    // Finish by binding the Reportmonthly middleware
    app.param('dates', reportdailies.reportMonthBydate);
    app.param('employeeids', reportdailies.reportmonthByEmployeeid);
};
