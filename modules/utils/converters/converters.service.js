angular.module('edp.converters').filter('temperature', function(){
    return function(number, type){
        if(isNaN(number)){
            return number;
        } else {
            return number + (type.toUpperCase() === 'C' ? '℃' : '℉');
        }
    }
});