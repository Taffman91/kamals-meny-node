var anv;
var password;
var week;
var dag;
var facebookToken;
var day;
var doneOnce = 0;


process.argv.forEach(function (val, index, array) {
  if(index == 2){
    anv = val;
  }
  else if(index == 3){
    password = val;
  }
  else if(index == 4){
    facebookToken = val;
  }
});

checkDate();
setInterval(checkDate, 1000);

function checkDate(){

  Date.prototype.getWeek = function() {
          var onejan = new Date(this.getFullYear(), 0, 1);
          return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
      }

  week = (new Date()).getWeek();
  day = new Date().getDay();
  var date = new Date();
  var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
  //console.log(day);

  if(day >= 2){
    doneOnce=0;
  }
  else if(day == 0){
    doneOnce=0;
  }

  if(day == 1 && hour == '00' && min == '00' && sec == '00' && doneOnce == 0){
    doneOnce=1;
    if(anv != null){
      if(password != null){
        checkFacebook();
      }
    }
  }
}
function checkFacebook(){
  var graph = require('fbgraph');
  graph.setAccessToken(facebookToken);

  var data;

  graph.get("Kamalsrestaurang/feed?limit=1", function(err, res) {
    data = res.data[0].message;
    //console.log(res.data[0]);
    //console.log(data);
    sendMail(data);
  });
}


function sendMail(data1){

  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: anv,
        pass: password
      }
  });

  var mailOptions = {
      from: '"Alfred Skedebäck" <' + anv + '>', // sender address
      to: 'alfred.skedeback@trademax.se', // list of receivers
      subject: 'Kamals meny v' + week, // Subject line
      text: data1 //, // plain text body
      // html: '' + data1 + '' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
          return console.log(error);
      }
      else {
        console.log('Message %s sent: %s', info.messageId, info.response);
      }
      transporter.close();
  });
}
