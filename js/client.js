'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('client', [
  // 'ngAnimate',
  'ui.router',
  'ui.bootstrap',
  'app.controller'
])
.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
  // It's very handy to add references to $state and $stateParams to the $rootScope
  // so that you can access them from any scope within your applications.For example,
  // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
  // to active whenever 'contacts.list' or one of its decendents is active.
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.$jwt = jwt;
}])
.config(['$httpProvider', '$rootScopeProvider', function($httpProvider, $rootScopeProvider) {
  $httpProvider.interceptors.push(function($q, $rootScope) {
    return {
      request: function(config) {
        config.headers['Content-Type']  = 'application/json';
        return config;
      },
      responseError: function(rejection, response, status) {
        $rootScope.$broadcast('responseErrorStart', rejection);
        return $q.reject(rejection);
      }
    };
  });
}])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  /////////////////////////////
  // Redirects and Otherwise //
  /////////////////////////////
  // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
  $urlRouterProvider
    // .when('/c?id', '/contacts/:id')
    .when('/project/:name', '/project/:name/project')
    .otherwise('/default');
  // Use $stateProvider to configure your states.
  $stateProvider
    .state("default", {
      url: "/default",
      templateUrl: 'views/default.html'
    })
    .state('user', {
      url: '/user',
      templateUrl: 'views/user.html'
    })
    .state('key', {
      url: '/key',
      templateUrl: 'views/key.html'
    })
    .state('project', {
      url: '/project/:project',
      templateUrl: 'views/menu.html'
    })
    .state('project.project', {
      url: '/project',
      templateUrl: 'views/project.html'
    })
    .state('project.camare', {
      url: '/camare',
      templateUrl: 'views/camare.html'
    })
    .state('project.log', {
      url: '/log',
      templateUrl: 'views/log.html'
    });
}]);