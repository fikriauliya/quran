angular.module('quran.controllers.page', ['ionic', 'fsCordova'])

.controller('PageCtrl', function($scope, $state, $stateParams, SurahTextServices, CordovaService) {
  $scope.pageNo = $stateParams.pageNo;
  $scope.surahName = SurahTextServices.getSurahName(SurahTextServices.getSurahNo($scope.pageNo));
  $scope.status = "";
  $scope.baseImageURL = "";
  
  var is_downloaded = localStorage.getItem("page_" + $scope.pageNo + "_downloaded");
  if (is_downloaded === null) {
    errorHandler("Page is not yet downloaded");
  } else {
    CordovaService.ready.then(function() {
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
    });
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

  $scope.goHome = function(cur_surah) {
    $state.go('app.pages')
  }
});