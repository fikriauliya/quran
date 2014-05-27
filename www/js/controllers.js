angular.module('quran.controllers', ['ionic'])

.controller('AppCtrl', function($scope) {
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('PagesCtrl', function($scope, $state, $ionicPopup, SurahTextServices) {
  $scope.surah = SurahTextServices.getAllSurah();
  $scope.go = function(cur_surah) {
    $state.go('app.page', {'pageNo':cur_surah.page})
  }

  $scope.startDownload = function() {
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
              $scope.downloaded_count = $scope.downloaded_count + 1;
              $scope.progress = $scope.downloaded_count * 100 / 604;
              callback();
            }
          }
        }, function(err){
          popup.close();
          if (err && err != "Download stopped") {
            window.alert("An error occured while downloading. Plaese make sure the Internet is on & there is enough space in memory");
            console.log(err);
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
})

.controller('PageCtrl', function($scope, $stateParams, SurahTextServices) {
  $scope.pageNo = $stateParams.pageNo;
  $scope.surahName = SurahTextServices.getSurahName(SurahTextServices.getSurahNo($scope.pageNo));
  $scope.status = "";
  $scope.baseImageURL = "";
  
  var is_downloaded = localStorage.getItem("page_" + $scope.pageNo + "_downloaded");
  if (is_downloaded === null) {
    errorHandler("Page is not yet downloaded");
  } else {
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(PERSISTENT, 0, onInitFs, errorHandler);

    function onInitFs(fileSystem) {
      fileSystem.root.getDirectory('quran_resources', {create: true}, function(dirEntry) {
        console.log(dirEntry.toURL());
        $scope.$apply(function(){
          $scope.baseImageURL = dirEntry.toURL() + '/quran';
        });
      });
    }
  }
  
  function errorHandler(message) {
    console.log(message);
    $scope.baseImageURL = 'https://raw.githubusercontent.com/fikriauliya/quran_resources/master/images';
  }

  $scope.prev = function() {
    if (parseInt($scope.pageNo) > 1) {
      $scope.pageNo = parseInt($scope.pageNo) - 1;
    } else {
      $scope.pageNo = SurahTextServices.getPageCount();
    }
    $scope.surahName = SurahTextServices.getSurahName(SurahTextServices.getSurahNo($scope.pageNo));
  }

  $scope.next = function() {
    if (parseInt($scope.pageNo) < SurahTextServices.getPageCount()) {
      $scope.pageNo = parseInt($scope.pageNo) + 1;
    } else {
      $scope.pageNo = 1;
    }
    $scope.surahName = SurahTextServices.getSurahName(SurahTextServices.getSurahNo($scope.pageNo));
  }
});