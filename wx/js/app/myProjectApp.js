//var wx_api = "http://api.opensight.cn/api/ivc/v1/wechat/";
//var bindUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
//    "appid=wxd5bc8eb5c47795d6&redirect_uri=http%3A%2F%2Fwww.opensight.cn%2Fwx%2F" +
//    "bind.html&response_type=code&scope=snsapi_userinfo&state=myProject" +
//    "#wechat_redirect";
//var codeLoginUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
//    "appid=wxd5bc8eb5c47795d6&redirect_uri=http%3A%2F%2Fwww.opensight.cn%2Fwx%2F" +
//    "myProject.html&response_type=code&scope=snsapi_userinfo&state=myProject" +
//    "#wechat_redirect";
var G_ProjectName = "";

var app = angular.module('app', ['ui.router', 'oc.lazyLoad', 'angular-loading-bar', 'ngAnimate', 'ui.bootstrap']);

app.config(function($controllerProvider, $compileProvider, $filterProvider, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $provide) {
  app.register = {
    controller: $controllerProvider.register,
    directive: $compileProvider.directive,
    filter: $filterProvider.register,
    factory: $provide.factory,
    service: $provide.service
  };

  app.asyncjs = function(js) {
    return ['$ocLazyLoad', function($ocLazyLoad) {
      return $ocLazyLoad.load(js);
    }];
  };

  $urlRouterProvider
    .when('/', '/project')
    .otherwise('/project');

  $stateProvider
    .state('project', {
      url: '/project',
      templateUrl: './views/projectList.html',
      params: { projectName: null, info: null },
      resolve: {
        load: app.asyncjs("./js/controller/ProjectList.js")
      }
    })

  .state('camera', {
      url: '/camera',
      templateUrl: './views/cameraList.html',
      params: { projectName: null, info: null },
      resolve: {
        load: app.asyncjs(["./js/controller/cameraList.js", "./js/video.js", "./css/square.css"])
      }
    })
    .state('backup', {
      url: '/backup',
      templateUrl: './views/backup.html',
      params: { projectName: null, info: null },
      resolve: {
        load: app.asyncjs(["./js/controller/backup.js"])
      }
    })
    .state('backuprecord', {
      url: '/backuprecord',
      templateUrl: './views/backup-record.html',
      params: { projectName: null, info: null },
      resolve: {
        load: app.asyncjs(["./js/controller/backup-record.js"])
      }
    })

  .state('plive', {
    url: '/plive',
    templateUrl: './views/pLive.html',
    resolve: {
      load: app.asyncjs(["./js/controller/PLive.js?_=1471563671720"])
    }
  })

  .state('prec', {
    url: '/prec',
    templateUrl: './views/pRec.html',
    resolve: {
      load: app.asyncjs(["./js/controller/PRec.js?_=1471563671720"])
    }
  })

  .state('precplay', {
    url: '/precplay',
    templateUrl: './views/pRecPlay.html',
    resolve: {
      load: app.asyncjs(["./js/controller/PRecPlay.js?_=1471563671720"])
    }
  })

  .state('bill', {
    url: '/bill',
    templateUrl: './views/billList.html',
    params: { projectName: null, info: null },
    resolve: {
      load: app.asyncjs("./js/controller/billList.js")
    }
  });


})

.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push(function($q, $rootScope) {
    return {
      request: function(config) {
        config.headers.Authorization = "Bearer " + jwt.jwt;
        config.headers['Content-Type'] = 'application/json';
        return config;
      },
      responseError: function(rejection, response, status) {
        $rootScope.$emit('responseErrorStart', rejection);
        return $q.reject(rejection);
      }
    };
  });
}]);

app.controller('MyProject', ['$rootScope', '$scope', '$http', '$q', '$window', '$state', function($rootScope, $scope, $http, $q, $window, $state) {
  (function() {
    var binding_id = $.cookie('binding_id');
    var timestamp = Math.round(new Date().getTime() / 1000);
    var noncestr = binding_id + new Date().getTime().toString();
    var url = window.location.href;
    $http.post('http://api.opensight.cn/api/ivc/v1/wechat/bindings/' + binding_id + '/jsapi_signature', {
      timestamp: timestamp,
      noncestr: noncestr,
      url: url
    }).success(function(res) {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.appid, // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: noncestr, // 必填，生成签名的随机串
        signature: res.signature, // 必填，签名，见附录1
        jsApiList: ['onMenuShareAppMessage', 'showMenuItems', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
    });
  })();
  $scope.destroy = function() {
    if (undefined !== $scope.aborter) {
      $scope.aborter.resolve();
      delete $scope.aborter;
    }
  };

  $scope.$on('$destroy', $scope.destroy);

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (fromState.name === 'plive' || fromState.name === 'prec' || fromState.name === 'precplay') {
      if ($rootScope.Player !== undefined) $rootScope.Player.destroy();
      var player = $rootScope.RecPlayer;
      if (player !== null && player !== undefined && player.currentTime) {
        player.currentTime = 0;
        player.pause();
        player.src = "movie.ogg";
        player.load();
      }
    }
  });
}]);

app.filter('online', [function() {
  return function(is_online) {
    if (1 === is_online) {
      return '在线';
    } else if (2 === is_online) {
      return '工作中';
    } else {
      return '离线';
    }
  };
}])

.filter('publicattribute', [function() {
  return function(bBublic) {
    if (true === bBublic) {
      return '公开';
    } else {
      return '私有';
    }
  };
}])

.filter('key_type', [function() {
  return function(type) {
    if (1 === type) {
      return '管理员';
    } else {
      return '操作员';
    }
  };
}])

.filter('key_enabled', [function() {
  return function(enabled) {
    if (true === enabled) {
      return '启用';
    } else {
      return '停用';
    }
  };
}])

.filter('getLink', [function() {
  return function(item) {
    if (0 === item.status) {
      return '#';
    }
    return '../video.html?uuid=' + item.uuid + '&project=' + G_ProjectName;
  };
}])

.filter('duration', function() {
  var a = [{ t: '分', v: 60 }, { t: '时', v: 60 }, { t: '天', v: 24 }];
  return function(dur, ms) {
    var s = '';
    dur = Math.floor(dur / (1000 * 60));
    for (var i = 0, l = a.length; i < l; i++) {
      s = dur % a[i].v + a[i].t + s;
      dur = Math.floor(dur / a[i].v);
      if (0 === dur) {
        break;
      }
    }
    return s;
  };
})

// .filter('duration', function() {
//   var a = [{ t: '秒', v: 60 }, { t: '分', v: 60 }, { t: '时', v: 60 }, { t: '天', v: 24 }];
//   return function(dur, ms) {
//     var s = '';
//     if (true === ms) {
//       dur = Math.floor(dur / 1000);
//     }
//     for (var i = 0, l = a.length; i < l; i++) {
//       s = dur % a[i].v + a[i].t + s;
//       dur = Math.floor(dur / a[i].v);
//       if (0 === dur) {
//         break;
//       }
//     }
//     return s;
//   };
// })
;

app.factory('dateFactory', function() {
  var padding = function(n) {
    if (10 > n) {
      return '0' + n;
    }
    return n.toString();
  };
  var getDate = function(dt) {
    return [
      dt.getFullYear(),
      padding(dt.getMonth() + 1),
      padding(dt.getDate())
    ].join('-');
  };
  return {
    getStart: function(dt) {
      return getDate(dt) + 'T00:00:00';
    },
    getEnd: function(dt) {
      return getDate(dt) + 'T23:59:59';
    },
    time2str: function(dt) {
      return padding(dt.getHours()) + ':' + padding(dt.getMinutes()) + ':' + padding(dt.getSeconds());
    },
    str2time: function(str, bstart) {
      var a = str.split(':');
      var dt = new Date();
      dt.setHours(a[0]);
      dt.setMinutes(a[1]);
      dt.setSeconds(a[2]);
      if (bstart) {
        dt.setMilliseconds(0);
      } else {
        dt.setMilliseconds(999);
      }
      return dt;
    },
    getms: function(dt, tm) {
      var tmp = tm;
      tmp.setFullYear(dt.getFullYear(), dt.getMonth(), dt.getDate());
      return tmp.getTime();
    }
  };
});
