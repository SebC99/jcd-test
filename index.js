/**
 * Created by sebastien on 30/05/2014.
 */

var twitter = require('ntwitter');

var twit = new twitter({
    consumer_key: '4IgUJfWkMGhRnHhZTcqYVUAiv',
    consumer_secret: 'FEZYbfl9uOdbIgbdXOrSUttMJnGE71c7mWvoC3ORP3wvNip9vt',
    access_token_key: '455856593-fh5nrLCPjd9AfFJqCnxSdjg7ccDrsCReVfwpSjya',
    access_token_secret: 'MaXStD6irgOrVB8LoId2lDvYFtlNrdB6NKp1GxzMH5VDz'
});

var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "zellnologger@gmail.com",
        pass: "smopping"
    }
});

var initial_followers = 0;
var timer = 30 * 60 * 1000;


function testFollowers() {
    twit.showUser('isai_fr', function(err, data) {
        var count = data[0].followers_count;
        console.log("JCD tested with count=",count);
        if (count != initial_followers) {
            smtpTransport.sendMail({
                from: "Twitter Test App <zellnologger@gmail.com>", // sender address
                to: "sebastien.caron@gmail.com", // list of receivers
                subject: "JCD has a new follower", // Subject line
                text: "Just to warn you that JCD has now " + count.toString() + " followers" // plaintext body
            }, function (error, response) {
                if(error){
                    console.log(error);
                }else{
                    console.log("Message sent: " + response.message);
                }
            });
            initial_followers = count;
            timer = Math.max(0,(8999 - count) * 60 * 1000);
            console.log("Interval updated to ",timer/60/1000);
        }
    });
}

function start() {
    setInterval(testFollowers, timer);
}

testFollowers();



