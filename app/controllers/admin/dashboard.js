var express = require('express'),
    router = express.Router(),
    cradle = require('cradle'),
    dateutil = require('date-utils');

module.exports = function (app) {
    app.use('/admin/dashboard', router);
};
//取得db对象
db = require('../../../config/dbutil');

var totalCount;   //总课程数（分页用）
var perPage = 10 ;  //每页显示10条数据
var totalPage ;   //总页数
var date = new Date();
var now = date.toFormat("YYYY-MM-DD HH24:MI:SS");
//显示dashboard页面
router.get('/', function (req, res, next) {
    //取得总课程数和总页数
    db.view('Course/course_count', function (err, count) {
        if(!err){
            console.log(now);
            totalCount = count[0].value;
            totalPage = Math.ceil(totalCount / perPage );
            //分页请求，按照请求的页数显示数据
            if(req.query.pageNum){
                db.view('Course/user_courseList_view', {descending: true, skip: (req.query.pageNum - 1) * perPage, limit: perPage}, function (err, rows) {
                    if(!err){     
                        var courses = new Array();
                        courses = getCourseStatus(rows);
                        res.render('admin/dashboard', {
                            courseList: courses,
                            totalPage: totalPage,
                            pageNum: parseInt(req.query.pageNum),
                            title:'Dashboard for Admin'
                        });
                    }else{
                        console.log("app.js get course_List for admin error: " + err);
                    }  
                });
            //非分页请求，直接显示第一页
            }else {
                db.view('Course/user_courseList_view', {descending: true,limit: perPage}, function (err, rows) {
                    if(!err){
                        var courses = new Array();
                        courses = getCourseStatus(rows);
                        res.render('admin/dashboard', {
                            courseList: courses,
                            totalPage: totalPage,
                            pageNum: 1,
                            title:'Dashboard for Admin'
                        });
                    }else{
                        console.log("app.js get course_List for admin error: " + err);
                    }  
                });
            }
        }else{
            console.log("app.js get course_count error: " + err);
        }
    });
});



//Create Course页面
router.get('/create', function (req, res, next) {
    res.render('admin/CreateCourse', {
        title:'Create Course'
    });
});

//Feedback 页面

//Export Enroll to cvs

//Export Feedback to cvs

//Course

/*根据课程时间和Enroll结束时间判断课程状态：
enroll结束时间大于当前时间：Enrolling
课程开始时间大于当前时间：Waiting Course Start
课程开始1周以前：Feedbacking
课程开始一周以后：Complaged
*/
function getCourseStatus(rows) {
    var courses = new Array();
    rows.forEach(function (id, row) {
        if (row['EnrEndD'] > now) {
            row.status = 'Enrolling';
        }else if(row['CDate'] > now){
            row.status = 'Waiting Course Start';
        }else if(row['FEndDate'] > now){
            row.status = 'Feedbacking'
        }else{
            row.status = 'Complated'
        }
        courses.push(row);
    });
    return courses;
}