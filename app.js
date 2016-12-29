var express = require('express'),
  config = require('./config/config');

//connect cloudant db for running on bluemix
/*var cradle = require('cradle');
 var services = JSON.parse(process.env.VCAP_SERVICES);
 var credentials = services['cloudantNoSQLDB'][0].credentials;
 var host = credentials.host;
 var port = credentials.port;
 var options = {
 cache: true,
 raw: false,
 secure: true,
 auth: {
 username: credentials.username,
 password: credentials.password
 }
 };*/

//connect cloudant db for running on local
/*var cradle = require('cradle');
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
var db = new (cradle.Connection)(host, port, options).database('enroll_system');*/


var app = express();
module.exports = require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});
