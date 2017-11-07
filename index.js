(function () {
    'use strict';

    /**
     * Escape special characters in the given string of html.
     *
     * @param  {String} html
     * @return {String}
     */
    let fileManager = null;
    module.exports = {

        use: function (obj) {
            switch (obj.platform){
                case 'S3TOKEN': {
                    fileManager=require('./platformsManagers/S3TokenManager');
                    break;
                }
                case 'MONGO':{
                    fileManager=require('./platformsManagers/MongoManager');
                    break;
                }
                case 'LOCALHOST':{
                    fileManager=require('./platformsManagers/LocalhostManager');
                    break;
                }
            }
        },
        saveFile: function (obj) {
          return fileManager.saveFile(obj);
        },
        getFile: function (obj) {
            return fileManager.getFile(obj);
        },
        getToken: function (obj) {
            return fileManager.getToken(obj);
        },
        existThumbnail: function (obj) {
          return fileManager.existThumbnail(obj);
        },
        moveFile: function (obj) {
        return fileManager.moveFile(obj);
        },
        getSignedUrl: function (obj) {
          return fileManager.getSignedUrl(obj);
        },
        copyFile: function (obj) {
          return fileManager.copyFile(obj);
        },
        deleteFile: function (obj) {
          return fileManager.deleteFile(obj);
        }

    };
}());
