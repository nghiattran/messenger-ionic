'use strict';

angular.module('starter.auth', [
  'starter.constants',
  'starter.util',
  'ngCookies',
  'ui.router',
  'LocalStorageModule'
])
  .config(function($httpProvider, localStorageServiceProvider) {
    $httpProvider.interceptors.push('authInterceptor');

    localStorageServiceProvider
      .setPrefix('');
  });