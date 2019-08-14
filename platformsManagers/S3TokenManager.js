(function () {
  'use strict';
  let crypto = require('crypto');
  let moment = require('moment');
  let AWS = require('aws-sdk');


  module.exports = {
    getToken: function (obj) {
      let s3Url = 'https://' + obj.aws.bucket + '.s3-' + obj.aws.region + '.amazonaws.com';
      let path = obj.file.route;
      let filename = obj.file.filename;
      let readType = 'private';
      let expirationTime = 300;
      if(obj.aws.expirationTime){
        expirationTime = obj.aws.expirationTime;
      }
      let expiration = moment().add(expirationTime, 's').toDate(); //expiration time in minutes

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
          ['content-length-range', 0, 524288000], //min and max in bytes ( 2Kb - 500Mb)
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
        },
        filename
      };

    },
    getFile: function (obj) {
      return new Promise(function (fulfill, reject) {
        let s3 = generateS3Credentials(obj);
        var params = {
          Bucket: obj.aws.bucket,
          Key: obj.file.key
        };
        s3.getObject(params, function (err, data) {
          if (err) {
            reject(err);
          }
          else {
            fulfill(data);
          }
        });
      });
    },
    saveFile: function (obj) {

      return new Promise(function (fulfill, reject) {
        let s3 = generateS3Credentials(obj);
        var params = {
          Bucket: obj.aws.bucket,
          Key: obj.file.key,
          Body: obj.file.buffer
        };
        console.log('s3 paramns savefile', params);
        s3.upload(params, function (err, data) {
          if (err) {
            console.log('err save file', err);
            reject(err);
          }
          else {
            console.log('save file success', data);
            fulfill(data);
          }
        });
      });

    },
    existThumbnail(obj){
      console.log('existThumbnail');
      let fileToCheck = Object.assign({}, obj);
      return new Promise(function (fulfill, reject) {
        let s3 = generateS3Credentials(obj);
        console.log('s3', s3);
        var params = {
          Bucket: obj.aws.bucket,
          Key: obj.file.key
        };

        console.log('s3 params', params);

        s3.headObject(params, function (err, data) {
          if (err && err.code === 'NotFound') {
            console.log('err', err.stack); // an error occurred
            fulfill({thumb: fileToCheck.file.key, exist: false});
          }
          else if (err) {
            reject(err);
          }
          else {
            console.log('sucess', data);  // successful response
            fulfill({thumb: fileToCheck.file.key, exist: true});
          }

        });
      });
    },
    moveFile: function (obj) {

      return new Promise(function (fulfill, reject) {
        let s3 = generateS3Credentials(obj);

        var params = {
          CopySource: obj.aws.srcBucket + '/' + obj.file.key,
          Bucket: obj.aws.dstBucket,
          Key: obj.file.key
        };
        console.log('s3 params savefile', params);
        s3.copyObject(params, function (err, data) {
          if (err) {
            console.log(err, err.stack);
            reject(err);
          } // an error occurred
          else {
            console.log('s3 move bucket file success', data);   // successful response
            var paramsDelete = {
              Bucket: obj.aws.srcBucket,
              Key: obj.file.key
            }
            console.log('s3 paramsDelete', paramsDelete);
            s3.deleteObject(paramsDelete, function (err, dataDeleted) {
              if (err) {
                console.log('s3 delete file error', err.stack);
                reject(err);
              } else {
                console.log('s3 delete file success', dataDeleted);
                fulfill(dataDeleted);
              }
            });
          }
        });
      });

    },
    getSignedUrl: function (obj) {
      return new Promise(function (fulfill, reject) {
        let s3 = generateS3Credentials(obj);
        let expirationTime = 900; //seconds
        if(obj.aws.expirationTime){
          expirationTime = obj.aws.expirationTime;
        }
        var params = {
          Bucket: obj.aws.bucket,
          Key: obj.file.key,
          Expires:expirationTime  //expiration time in seconds
        };
        console.log('s3 params getSignedUrl', params);
        s3.getSignedUrl('getObject', params, function (err, url) {
          if (err) {
            reject(err);
          }
          else {
            console.log('The URL is', url);
            fulfill({url: url, key: obj.file.key})
          }
        });

      });
    },
    copyFile: function (obj) {
      return new Promise(function (fulfill, reject) {
        let s3 = generateS3Credentials(obj);
        var params = {
          CopySource: obj.aws.srcBucket + '/' + obj.file.key,
          Bucket: obj.aws.dstBucket,
          Key: obj.file.key
        };
        console.log('s3 params copy file', params);
        s3.copyObject(params, function (err, data) {
          if (err) {
            console.log(err, err.stack);
            reject('s3 copy file error', err);
          }
          else {
            console.log('s3 copy file success', data);
            fulfill(data);
          }
        });
      });
    },

    deleteFile: function (obj) {
      return new Promise(function (fulfill, reject) {
        let s3 = generateS3Credentials(obj);

        var params = {
          Bucket: obj.aws.bucket,
          Key: obj.file.key
        };
        s3.deleteObject(params, function (err, data) {
          if (err) {
            console.log('s3 delete file error', err.stack);
            reject(err);
          } else {
            console.log('s3 delete file success', data);
            fulfill(data);
          }
        });
      });
    }

  };


  function generateS3Credentials(obj) {
    let s3Options = {
      accessKeyId: obj.aws.accessKey,
      secretAccessKey: obj.aws.secret,
      region: obj.aws.region
    };
    return new AWS.S3(s3Options);
  }
}());
