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

  var popup = $ionicPopup.show({
    templateUrl: 'templates/download-modal.html',
    title: 'Downloading...',
    scope: $scope,
    buttons: [
      { 
        text: 'Cancel',
        type: 'button-positive',
        onTap: function(e){
          return "Canceled";
        }
      }
    ]
  });
  // popup.then(function(res) {
  // });

  $scope.progress = 0;
  $scope.downloaded_count = 0;

  $scope.startDownload = function() {
    var indexes = [];
    for (var i = 1; i <= 604; i++) {
      indexes.push(i);
    };
    
    async.eachSeries(indexes, function(i, callback){
      is_downloaded = localStorage.getItem("page_" + i + "_downloaded");
      if (is_downloaded === null) {
        var fileTransfer = new FileTransfer();
        var uri = encodeURI("https://raw.githubusercontent.com/fikriauliya/quran_resources/master/images_small/" + i + ".png");
        var fileURL = 'file:///storage/emulated/0/quran/' + i + '.png';

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
        callback();
      }
    }, function(err){
      if (err) {
        window.alert("Error: " + err);
      } else {
        popup.close();
      }
    });
  }

  if (typeof(FileTransfer) === "function") { 
    $scope.startDownload();
  } else {
    console.log("FileTransfer function is undefined");
  }
})

.controller('PageCtrl', function($scope, $stateParams, SurahTextServices) {
  $scope.pageNo = $stateParams.pageNo;
  $scope.surahName = SurahTextServices.getSurahName(SurahTextServices.getSurahNo($scope.pageNo));
  $scope.status = "";

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