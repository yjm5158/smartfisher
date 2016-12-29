var express = require('express'),
    router = express.Router(),
    cradle = require('cradle'),
    dateutil = require('date-utils'),
    fs = require('fs'),
	multipart = require('connect-multiparty'),
	multipartMiddleware = multipart();

module.exports = function (app) {
    app.use('/admin/createCourse', router);
};
//取得db对象
db = require('../../../config/dbutil');

router.post('/', multipartMiddleware, function (req, res, next) {
	var EnrList = new Array();
	var newCourse = {
		CourseID : req.body.CourseID,
		CourseName : req.body.CourseName,
		Teacher : req.body.Teacher,
		Seat : req.body.Seat,
		SeatLeft : req.body.Seat,
		CDate : req.body.CDate,
		Duration : req.body.Duration,
		EnrEndD : req.body.EnrEndD,
		FdEndD : req.body.FdEndD,
		Location : req.body.Location,
		AvrageScore : 0,
		TeacherDescr : req.body.TeacherDescr,
		Descr : req.body.Descr,
		EnrList : EnrList
	};
	//save record
	db.save(newCourse, function(err){
		if(!err){
			//上传图片文件
			var filename = req.files.CourseLogo.name;
			var filePath = req.files.CourseLogo.path;
			var filetype = req.files.CourseLogo.type;
			//先取得newCourse的_id,_rev
			db.view('Course/attach_view', {key: req.body.CourseID}, function (err, row) {
				if(!err){
					var idData = {
						id: row[0].value.id,
						rev: row[0].value.rev
					};
					var attachmentData = {
						name: filename,
						'Content-Type': filetype
					};
					var readStream = fs.createReadStream(filePath);
					var writeStream  = db.saveAttachment(idData, attachmentData, function (err, reply) {
					if (err) {
						console.dir(err);
						return;
					}
					console.dir(reply);
					});
					readStream.pipe(writeStream);

					res.redirect('/admin/dashboard');
				}else{
					console.log('save new course error!');
				}
			});
		}else{
			console.log('save new course error!');
		}
	});
});
