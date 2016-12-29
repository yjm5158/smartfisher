var cradle = require('cradle');
var host = "61924910-3a4d-446b-a0dd-a0f1212838b8-bluemix.cloudant.com";
var port = 443;
var options = {
  cache: true,
  raw: false,
  secure: true,
  auth: {
    username: "61924910-3a4d-446b-a0dd-a0f1212838b8-bluemix",
    password: "2dc48ba8549f34098b05bb1643f499bc8cb719ef0f9d5bbde66aaee7ee958e69"
  }
};
//链接DB并创建db对象
var db = new (cradle.Connection)(host, port, options).database('enroll_system');

module.exports = db;
