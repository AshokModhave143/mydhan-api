const AwsUtil = require('./../../../utils/awsutil');

const changePassword = async (req, res, next)=> {
    console.log(JSON.stringify(req.body));
    const msg = req.body.message;
    let all = await AwsUtil.publish.publishNotificationToAll('', 'MyDhan-All', msg);
    //let sms='',email='';
    let sms = await AwsUtil.publish.publishSms('', 'MyDhan-Sms', msg);
    let email = await AwsUtil.publish.publishEmail('', 'MyDhan-Email', msg);

    res.send({ all: all, sms: sms, email: email});
};

module.exports = changePassword;