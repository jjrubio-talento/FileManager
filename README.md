# File Manager

Node module to implement an file manager

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.


### Installing


Command to install

```
npm install git://192.168.1.150:/volume1/git_repos/NodeModules/FileManager.git
```

## Deployment

In express initialization you must initialize the platform to use:
```
const file=require('file-manager');

file.use({platform:'NAME OF PLATFORM'});  
```
#### Values of platforms:
* S3TOKEN
* MONGO
* LOCALHOST

#### Functions:

##### S3TOKEN
###### getToken({Object})
Params: Object
  
    {
        file:{
                route: 'Route of the file',
                type: 'File type'
             },
        aws: {
                bucket: 'AWS bucket',
                region: 'AWS region',
                secret: 'AWS secret key',
                accessKey: 'AWS access key',
                expirationTime: 'Time of expiration in minutes'
             }
    }
        
Return: Object with aws credentials

###### getFile({Object})
Params: Object
  
    {
        file:{
                key: 'File key identification'
             },
        aws: {
                bucket: 'AWS bucket',
                region: 'AWS region',
                secret: 'AWS secret key',
                accessKey: 'AWS access key'
             }
    }
        
Return: a file in Uint8Array format

###### saveFile({Object})
Description: Method that save a file in bucket indicated in params

Params: Object
  
    {
        file:{
                key: 'File key identification',
                buffer:'(Buffer, Typed Array, Blob, String, ReadableStream) Object data'
              },
        aws: {
                bucket: 'AWS bucket',
                region: 'AWS region',
                secret: 'AWS secret key',
                accessKey: 'AWS access key'
             }
    }
        
Return: the file saved in bucket of aws

###### existThumbnail({Object})
Description: Method that check if a thumbnail exist in bucket indicated in params

Params: Object
  
    {
        file:{
                key: 'File key identification'
             },
        aws: {
                bucket: 'AWS bucket',
                region: 'AWS region',
                secret: 'AWS secret key',
                accessKey: 'AWS access key'
             }
    }
        
Return: Object 

    {
        thumb:'key of thumbnail',
        exist:'boolean true or false'
    }
        
###### moveFile({Object})
Description: Method that move a file from origin bucket to  destination bucket 

Params: Object
  
    {
        file:{
                key: 'File key identification'
             },
        aws: {
                srcBucket: 'AWS source bucket',
                dstBucket: 'AWS destination bucket',
                region: 'AWS region',
                secret: 'AWS secret key',
                accessKey: 'AWS access key'
             }
    }
        
Return: Object with file moved 

###### getSignedUrl({Object})
Description: Method that generate a signed url

Params: Object
  
    {
        file:{
                key: 'File key identification'
             },
        aws: {
                Bucket: 'AWS bucket',
                region: 'AWS region',
                secret: 'AWS secret key',
                accessKey: 'AWS access key',
                Expires: 'Expiration time in second,900 seconds by default'
             }
    }
        
Return: a signed url

###### copyFile({Object})
Description: Method that copy a file from origin bucket to destination bucket 

Params: Object
  
    {
        file:{
                key: 'File key identification'
             },
        aws: {
                srcBucket: 'AWS source bucket',
                dstBucket: 'AWS destination bucket',
                region: 'AWS region',
                secret: 'AWS secret key',
                accessKey: 'AWS access key'
             }
    }
        
Return: Object with file copied 


###### deleteFile({Object})
Description: Method that delete a file 

Params: Object
  
    {
        file:{
                key: 'File key identification'
             },
        aws: {
                bucket: 'AWS bucket',
                region: 'AWS region',
                secret: 'AWS secret key',
                accessKey: 'AWS access key'
             }
    }
        
Return: Object with a file deleted
    
## Versioning

Version 1.0.0 

## Authors

* **Pablo Lobato** - *Initial work* -
* **Eduardo Cardo** - *Initial work* -

## License

©TalentoSoftware