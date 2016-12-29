var express = require('express'),
    router = express.Router(),
    cradle = require('cradle'),
    dateutil = require('date-utils');

module.exports = function (app) {
    app.use('/user/courseList', router);
};
//取得db对象
db = require('../../../config/dbutil');

//显示openCourse页面逻辑
router.get('/', function (req, res, next) {
    var date = new Date();
    var now = date.toFormat("YYYY-MM-DD HH24:MI:SS");

    db.view('Course/user_courseList_view',{descending: true}, function (err, rows) {
        var openCourse = new Array();
        var i = 0;
        if (!err) {
            //判断当前时间是否大于enroll结束时间，大于enroll结束时间的为openCourse
            rows.forEach(function (id, row) {
                if (row["EnrEndD"] > now) {
                    openCourse.push(rows[i]);
                }
            i++;
            //console.log("key: %s, row: %s", id, JSON.stringify(row));
            });
            res.render('user/courseList', {
                openCourses: openCourse,
                title: "Course list information"
            });
        } else {
            console.log("app.js courseList error: " + err);
        }
    });
});

