const publicIp = require('public-ip');
const nodemailer = require('nodemailer');
const fs = require('fs');

let transporter, mailOptions;

const getIP = async () => {
    try {
        let latestIP = await publicIp.v4();
        return latestIP;
    }
    catch (e){
        // if error just ignore and keep checking later
        return myIP;
    }
};

let myIP = (() => {
    if (fs.existsSync('myIP.json')) {
        return JSON.parse(fs.readFileSync('myIP.json', 'utf8')).IP;
    } else {
        getIP().then((latestIP) => { 
            fs.writeFileSync('myIP.json', JSON.stringify({"IP":myIP}), (err) => {
                if (err) throw err;
            });
            return latestIP;
        });
    }
})();

const IPcheckAndSendOnUpdate = () => {
    getIP().then((latestIP) => {
        // if IP changed, save it to file and send an email with new ip
        if(myIP !== latestIP){
            console.log('new ip:', latestIP);
            myIP = latestIP;
            fs.writeFileSync('myIP.json', JSON.stringify({"IP":myIP}), (err) => {
                if (err) throw err;
              });
            mailOptions.text = myIP;
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        } 
    });
};

//get credentials
(() => {
    let creds = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: creds.username,
            pass: creds.password
        }
    });

    mailOptions = {
        from: creds.username + '@yahoo.com',
        to: creds.email_recepient,
        subject: 'New IP detected',
        text: 'That was easy!'
    };
})(); 

setInterval(IPcheckAndSendOnUpdate, 10*1000);