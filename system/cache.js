var Cache = {
  remove: function(_expire){
          if( typeof(_expire)==='undefined') _expire = 0;
          var appDataDir, cacheDir, dir, externalRoot;
          if( Ti.Platform.osname == 'android'){
            if( Ti.Filesystem.isExternalStoragePresent() ){
              appDataDir = Ti.Filesystem.getFile('appdata://').nativePath;
              externalRoot = appDataDir.substring(0, appDataDir.lastIndexOf('/'));
              cacheDir = "" + externalRoot + "/Android/data/" + Ti.App.id + "/cache/_tmp/remote-cache";
              dir = Ti.Filesystem.getFile(cacheDir);
            }else{
              cacheDir = Ti.Filesystem.applicationCacheDirectory+'/_tmp/remote-cache';
              dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, '_tmp', 'remote-cache');
            }
          }else{
            cacheDir = Ti.Filesystem.applicationCacheDirectory;
            dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory);
          }
          if( dir.exists() ){
            if( !_expire ){
              // delete all
              dir.deleteDirectory(true);
              return dir.createDirectory();
            }else{
              var now = (new Date).getTime();
              var files = dir.getDirectoryListing();
              for( var i in files ){
                if( files[i].match(/jpg|jpeg|png|gif/i)){
                  var f = Ti.Filesystem.getFile(cacheDir, files[i]);
                  if( f.exists() && f.modificationTimestamp()!=0 && ( _expire == 0 || now - _expire > f.modificationTimestamp() )){
                    f.deleteFile();
                  }
                }
              }
            }
            return true;
          }
          return false;
        }
};
module.exports = Cache;
