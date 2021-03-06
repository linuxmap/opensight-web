'use strict';

app.filter('online', [function() {
  return function(is_online) {
    if (1 === is_online){
      return '在线';
    } else if (2 === is_online){
      return '直播中';
    } else {
      return '离线';
    }
  };
}]).filter('publicattribute', [function() {
  return function(bBublic) {
    if (true === bBublic){
      return '公开';
    } else {
      return '私有';
    }
  };
}]).filter('key_type', [function() {
  return function(type) {
    if (1 === type){
      return '管理员';
    } else {
      return '操作员';
    }
  };
}]).filter('key_enabled', [function() {
  return function(enabled) {
    if (true === enabled){
      return '启用';
    } else {
      return '停用';
    }
  };
}])

.filter('bill_type', [function() {
  return function(type) {
    if (0 === type){
      return '充值';
    } else {
      return '消费';
    }
  };
}])
;