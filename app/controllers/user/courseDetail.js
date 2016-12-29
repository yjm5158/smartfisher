var express = require('express'),
    router = express.Router(),
    cradle = require('cradle'),
    dateutil = require('date-utils');

module.exports = function (app) {
  app.use('/user/courseDetail', router);
};
//取得db链接对象
db = require('../../../config/dbutil');

//读取Course/user_courseDetail_view，显示courseDetail数据
router.get('/', function (req, res) {
  db.view('Course/user_courseDetail_view', {key: req.query.id}, function (err, row) {
    if (!err) {
      //还没引入session，IntranetID被写死。
      res.render('user/courseDetail', {
        courseDetail: row,
        IntranetID : 'Jian Ming Yu',
        title: "Course list information"
      });
      console.log(row);
    } else {
      console.log("app.js courseDetail error: " + err);
    }
  });
});

//enrollList页面表示逻辑
router.get('/enrollList', function (req, res) {
  console.log('enroll');
  db.view('Course/enroll_list_view', {key: req.query.id}, function (err, EnrList) {
    var CourseEnrollList = new Array;
    res.render('user/enrollL', {
      enrollList : EnrList[0].value ,
      title : "Course enroll list"
    });
  });
});

//enroll逻辑
router.post('/enroll', function (req, res) {
      db.get(req.body.id, function (err, row) {
        console.log('row:'+row);
        if (!err) {
          //如果enroll时有其他人enroll成功并且使剩余座位变成0，enroll失败，重定向到courseDetail页面
          if(row.SeatLeft == 0){
            req.flash('error', 'There is no seat now.');
            res.redirect('/user/courseDetail?id=' + req.body.id);
            return;
          }else{
            //判断是否重复报名
            for(var i=0; i<row.EnrList.length; i++){
              //判断当前报名的ID是否在EnrList中
              if(row.EnrList[i].IntranetID == 'test4'){
                console.log('chongfu baoming');
                req.flash('error', 'You have already enrolled.');
                res.redirect('/user/courseDetail?id=' + req.body.id);
                return;
              }
            }
            //有座位并且没有重复报名，用db.save方法更新数据
            var employee = {
              IntranetID: 'test4',
              Location: 'DL',
              FeedbackStatus:false,
              Feedback:{
                Score:0,
                Working:'',
                NWorking:'',
                Puzzled:''
              }
            };
            row.EnrList.push(employee);
            row.SeatLeft--;
            db.save(req.body.id,row,function(err){
              req.flash('info','enroll successful !');
              res.redirect('/user/courseDetail?id=' + req.body.id);
            });
        } 
      }else {
          console.log("app.js courseEnroll error: " + err);
      }
  });
});
