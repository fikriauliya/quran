angular.module('quran.controllers.pages', ['ionic'])

.controller('PagesCtrl', function($scope, $state, $ionicPopup, SurahTextServices) {
  $scope.surah = SurahTextServices.getAllSurah();
  if (localStorage.getItem("all_pages_downloaded") === null){
    $scope.not_all_downloaded = true;
  } else {
    $scope.not_all_downloaded = false;
  }

  $scope.go = function(cur_surah) {
    $state.go('app.page', {'pageNo':cur_surah.page})
  }

  $scope.startDownload = function() {
    if (localStorage.getItem("all_pages_downloaded") !== null) return;

    $scope.progress = 0;
    $scope.downloaded_count = 0;

    var stopDownload = false;
    var popup = $ionicPopup.show({
      templateUrl: 'templates/download-modal.html',
      title: 'Downloading...',
      scope: $scope,
      buttons: [
        { 
          text: 'Cancel',
          type: 'button-positive',
          onTap: function(e){
            stopDownload = true;
            return "Canceled";
          }
        }
      ]
    });
    popup.then(function(res) {
      console.log("Popup closed");
      console.log(res);
    });

    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(PERSISTENT, 0, onInitFs, errorHandler);  

    function onInitFs(fileSystem) {
      fileSystem.root.getDirectory('quran_resources', {create: true}, function(dirEntry) {
        console.log(dirEntry.toURL());

        var indexes = [];
        for (var i = 1; i <= 604; i++) {
          indexes.push(i);
        };

        async.eachSeries(indexes, function(i, callback){
          if (stopDownload != true) {
            var is_downloaded = localStorage.getItem("page_" + i + "_downloaded");
            if (is_downloaded === null) {
              var fileTransfer = new FileTransfer();
              var uri = encodeURI("https://raw.githubusercontent.com/fikriauliya/quran_resources/master/images_small/" + i + ".png");
              var fileURL = dirEntry.toURL() + '/quran/' + i + '.png';

              console.log(i);
              fileTransfer.download(
                uri,
                fileURL,
                function(entry) {            
                  localStorage.setItem("page_" + i + "_downloaded", true);
                  $scope.$apply(function() {
                    $scope.downloaded_count = $scope.downloaded_count + 1;
                    $scope.progress = $scope.downloaded_count * 100 / 604;
                  });
                  callback();
                },
                function(error) {
                  callback(error);
                },
                false);
            } else {
              $scope.$apply(function() {
                $scope.downloaded_count = $scope.downloaded_count + 1;
                $scope.progress = $scope.downloaded_count * 100 / 604;
              });
              callback();
            }
          }
        }, function(err){
          popup.close();
          if (err && err != "Download stopped") {
            window.alert("An error occured while downloading. Plaese make sure the Internet is on & there is enough space in memory");
            console.log(err);
          } else {
            localStorage.setItem("all_pages_downloaded", true);
            $scope.$apply(function() {
              $scope.not_all_downloaded = false;
            });
          }
        });
      }, errorHandler);
    }

    function errorHandler(message) {
      window.alert("An error occured while storing the image. Please make sure there is enough space in memory");
      console.log(message);
    }
  }

  if (typeof(FileTransfer) === "function") { 
    var is_first_time_loading = localStorage.getItem("is_first_time_loading");
    if (is_first_time_loading === null) {
      localStorage.setItem("is_first_time_loading", true);
      $scope.startDownload();
    } else {
      console.log("Not first time loading");
    }
  } else {
    console.log("FileTransfer function is undefined");
  }
});