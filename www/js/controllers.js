angular.module('quran.controllers', [])

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

.controller('PagesCtrl', function($scope, $state, SurahTextServices) {
  $scope.surah = SurahTextServices.getAllSurah();
  $scope.go = function(cur_surah) {
    $state.go('app.page', {'pageNo':cur_surah.page})
  }

  var fileTransfer = new FileTransfer();
  var uri = encodeURI("https://raw.githubusercontent.com/fikriauliya/quran_resources/master/images/1.png");
  var fileURL = 'file:///storage/emulated/0/quran/1.png'

  window.alert("Start download");
  fileTransfer.download(
      uri,
      fileURL,
      function(entry) {
          window.alert("download complete: " + entry.fullPath);
      },
      function(error) {
          window.alert("download error source " + error.source);
          window.alert("download error target " + error.target);
          window.alert("upload error code" + error.code);
      },
      false);
  window.alert("Finish download");
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