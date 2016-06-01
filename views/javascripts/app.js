/**
* codeburn Module
*
* Description
*/
 var app = angular.module('codeburn', [
 	'authservice',
 	'codeservice',
	'facultyservice',
	'challengeSolveService',
	'controllers',
	'facultyctrl',
	'routes'
]);

app.filter('unsafe',function($sce){
	return function(val){
		return $sce.trustAsHtml(val);
	};
});