const AwsConfig = require('./awsConfig');
const sns = AwsConfig.SNS;

const publishNotificationToAll = async (to, subject, msg) => {
    subject = (subject.length > 0) ? subject : 'MyDhan News';
    console.log(subject);
    let params = {
        Message: msg,
        Subject: subject,
        TopicArn:  AwsConfig.snsConfig.TopicArn
    };
    try {
        return await publish(params);
    }
    catch(e) {
        console.log("Error : " + e);
        return e;
    }
};
const publishSms = async (to, subject, msg)=> {
    subject = (subject.length > 0) ? subject : 'MyDhan';
    let params = {
        Message: msg,
        Subject: subject,
        TargetArn: AwsConfig.snsConfig.SmsTargetArn
    };
    try {
        return await publish(params);
    } catch(e) {
        return e;
    }
};
const publishEmail = async (to, subject, msg)=> {
    subject = (subject.length > 0) ? subject : 'MyDhan Notification';
    let params = {
        Message: msg,
        Subject: subject,
        TargetArn: AwsConfig.snsConfig.EmailTargetArn
    };
    try {
        return await publish(params);
    } catch(e) {
        return e;
    }
};
const publish = async (params)=> {
    return new Promise((resolve, reject)=> {
        sns.publish(params, (err, data)=> {
            if(err) {
                reject(err);
            }
            resolve(data);
        });
    });
}
/*
const publish = async (msg)=> {
    return new Promise(async (resolve, reject)=> {
        let params = {
            Message: JSON.stringify({
                default: msg,
                email: 'Email Message - ' +  msg,
                sms: 'SMS Message - ' + msg
            }),
            MessageStructure: 'json',
            Subject: 'MyDhan Notification',
            TargetArn: AwsConfig.snsConfig.SmsTargetArn
        };
        sns.publish(params, (err, data)=> {
            if(err) {
                console.log(err);
                reject(err);
            }
            else {
                console.log(data);
                resolve("Notification send Successfully");
            }
        });
    });
};
*/

module.exports = {publishNotificationToAll, publishSms, publishEmail};