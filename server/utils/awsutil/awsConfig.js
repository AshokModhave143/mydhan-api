//Import libs
const AWS = require('aws-sdk');

//AWS configuration
AWS.config.update({
    apiVersion: '2017-12-08',
    accessKeyId: '***REMOVED***',
    secretAccessKey: '***REMOVED***',
    region: 'ap-southeast-2'
});

//S3 Configuration
const S3BucketName = 'cent-mydhan';

//SNS configuration
const snsConfig = {
    TopicArn: 'arn:aws:sns:ap-southeast-2:346264802683:MydhanNotification',
    //SmsTargetArn: 'arn:aws:sns:ap-southeast-2:346264802683:MydhanNotification:f88554be-9756-42c1-8a28-3bcd882b34d6',
    //EmailTargetArn: 'arn:aws:sns:ap-southeast-2:346264802683:MydhanNotification:4f657672-da4a-4228-8f1f-1297fb9b67e7'
    SmsTargetArn: 'arn:aws:sns:ap-southeast-2:346264802683:MydhanNotification:d0983272-e75f-46f1-a635-d6c83d11e7cc',
    EmailTargetArn: 'arn:aws:sns:ap-southeast-2:346264802683:MydhanNotification:b382de07-6edc-4dcd-9eb8-e8fc72130b63'
};
//SMS : arn:aws:sns:ap-southeast-2:346264802683:MydhanNotification:f88554be-9756-42c1-8a28-3bcd882b34d6
//email : arn:aws:sns:ap-southeast-2:346264802683:MydhanNotification:4f657672-da4a-4228-8f1f-1297fb9b67e7

//Create Object
const S3 = new AWS.S3();
const SES = new AWS.SES();
const SNS = new AWS.SNS();

//Export Objects
module.exports = {S3BucketName, snsConfig, S3, SES, SNS};
