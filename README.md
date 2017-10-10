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
        file: 
            {
            route: 'ROUTE OF THE FILE',
            type: 'FILE TYPE'
            },
        aws: {
             bucket: 'AWS BUCKET',
             region: 'AWS REGION',
             secret: 'AWS SECRET KEY',
             accessKey: 'AWS ACCESS KEY'
             }
        }
        
Return: Object with aws credentials

## Versioning

Version 1.0.0 

## Authors

* **Pablo Lobato** - *Initial work* -
* **Eduardo Cardo** - *Initial work* -

## License

©TalentoSoftware