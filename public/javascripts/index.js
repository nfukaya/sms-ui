/***** Draggable Library *****/

angular.module('itsADrag',['ngSanitize'])

/**
  Possible element attributes:
    1.  template
    2.  id
    3.  options - json of jquery ui draggable options
    4.  group
    5.  placeholder
**/
.directive('draggable',[function(){
  return {
    restrict : 'AE',
    transclude : true,
    replace : true,
    // terminal : true, // make last directive to execute
    scope : {},
    templateUrl : function(el,attrs){
      return (angular.isDefined(attrs.template)) ? attrs.template : '/tmpls/draggable-default';
    },
    link : function(scope,el,attrs){
      // draggable object properties
      scope.obj = {
        id : null,
        content : '',
        group : null
      };
      scope.placeholder = false;
      
      scope.obj.content = el.html();
      
      if(angular.isDefined(attrs.id))
        scope.obj.id = attrs.id;
      
      if(angular.isDefined(attrs.placeholder))
        scope.placeholder = scope.$eval(attrs.placeholder);
      
      // options for jQuery UI's draggable method
      var opts = (angular.isDefined(attrs.options)) ? scope.$eval(attrs.options) : {};
      
      if(angular.isDefined(attrs.group)){
        scope.obj.group = attrs.group;
        opts.stack = '.' + attrs.group;
      }
      
      // event handlers
      var evts = {
        start : function(evt,ui){
          if(scope.placeholder) // ui.helper is jQuery object
            ui.helper.wrap('<div class="dragging"></div>');
          
          scope.$apply(function(){ // emit event in angular context
            scope.$emit('draggable.started',{obj: scope.obj});
          }); // end $apply
        }, // end start
        
        drag : function(evt){
          scope.$apply(function(){ // emit event in angular context
            scope.$emit('draggable.dragging');
          }); // end $apply
        }, // end drag
        
        stop : function(evt,ui){
          if(scope.placeholder)
            ui.helper.unwrap();
          
          scope.$apply(function(){ // emit event in angular context
            scope.$emit('draggable.stopped');
          }); // end $apply
        } // end stop
      }; // end evts
      
      // combine options and events
      var options = angular.extend({},opts,evts);
      el.draggable(options); // make element draggable
    } // end link
  }; // end return
}]) // end draggable

.run(['$templateCache',function($templateCache){
  $templateCache.put('/tmpls/draggable-default','<div ng-transclude></div>');
}]); // end itsADrag.run
  
/***** Application *****/
  
angular.module('adminMenu',['ngSanitize','itsADrag','ui.bootstrap'])

.controller('aMenuCtrl',['$scope',function($scope){
  $scope.onAtATime = true;
}]) // end aMenuCtrl

.run(['$templateCache',function($templateCache){
  $templateCache.put('/tmpls/floatingMenu','<div class="container"><div class="row"><div class="col-md-4"><div class="panel panel-primary"><div class="panel-heading cursor-move"><span class="pull-right"><a type="button" id="menuMinimize" class="btn btn-primary btn-xs" ng-init="minimized = false" ng-click="minimized = !minimized" data-toggle="collapse" href="#menuBody"><span class="glyphicon" ng-class="{false: \'glyphicon-chevron-up\',true: \'glyphicon-chevron-down\'}[minimized]"></span></a></span><span><big>Administrative Menu</big></span></div><div id="menuBody" class="panel-collapse collapse in"><div class="panel-body" ng-transclude></div><div class="panel-footer"><small>&nbsp;</small><span class="pull-right text-muted"><small>&copy; 2014 Michael Conroy</small></span></div></div></div></div></div></div>');
}]); // end adminMenu.run