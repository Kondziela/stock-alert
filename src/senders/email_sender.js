/**
 *  DEPRECATED!!
  * Class is not used
 */
var nodemailer = require('nodemailer'),
    user = require('../data/token.js').email_user,
    password = require('../data/token.js').email_password;

console.log(user, password);

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: password
  }
});

var mailOptions = {
  from: 'stack_bot@gmail.com',
  to: 'artur.kondziela@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});