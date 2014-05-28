// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'quran' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'quran.controllers' is found in controllers.js
angular.module('quran', ['ionic', 
  'quran.controllers.app', 
  'quran.controllers.page', 
  'quran.controllers.pages', 
  'quran.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.pages', {
      url: "/pages",
      views: {
        'menuContent' :{
          templateUrl: "templates/pages.html",
          controller: 'PagesCtrl'
        }
      }
    })

    .state('app.page', {
      url: "/pages/:pageNo",
      views: {
        'menuContent' :{
          templateUrl: "templates/page.html",
          controller: 'PageCtrl'
        }
      }
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"
        }
      }
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/pages');
});

