(function () {
    'use strict';
    let crypto = require('crypto');
    let moment = require('moment');

    module.exports = {
        get: function (obj) {
            return ('S3');
        },
        getToken: function (obj) {
            let s3Url = 'https://' + obj.aws.bucket + '.s3-' + obj.aws.region + '.amazonaws.com';
            let path = obj.file.route;

            let readType = 'private';

            let expiration = moment().add(5, 'm').toDate(); //5 minutes

            let s3Policy = {
                'expiration': expiration,
                'conditions': [{
                    'bucket': obj.aws.bucket
                },
                    ['starts-with', '$key', path],
                    {
                        'acl': readType
                    },
                    {
                        'success_action_status': '201'
                    },
                    ['starts-with', '$Content-Type', obj.file.type],
                    ['content-length-range', 2048, 10485760], //min and max
                ]
            };

            let stringPolicy = JSON.stringify(s3Policy);
            let base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

            // sign policy
            let signature = crypto.createHmac('sha1', obj.aws.secret)
                .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

            return {
                url: s3Url,
                fields: {
                    key: path,
                    AWSAccessKeyId: obj.aws.accessKey,
                    acl: readType,
                    policy: base64Policy,
                    signature: signature,
                    'Content-Type': obj.file.type,
                    success_action_status: 201
                }
            };
            // return credentials;
        }
    };
}());