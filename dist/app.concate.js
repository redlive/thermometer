angular.module('edp.thermo', []);angular.module('edp.thermo').factory('ThermoService', function() {
    var min = -2;
    var max = -(min);
    var step = .5;
    var defaultViewMode = 'C';

    function celsiusToFahrenheit(number){
        return number * 9 / 5 + 32;
    }

    function getRandomFloatNumber(viewMode){
        var b = boundaries(viewMode)
        return Math.random() * (b.max - b.min) + b.min;
    }

    function roundToDecimal(viewMode){
        return Math.round(getRandomFloatNumber(viewMode) * 10) / 10;
    }

    function finalizeTemperature(viewMode){
        var half = !(Math.random() + step | 0);
        return Math.floor(roundToDecimal(viewMode)) + (half ? step : 0);
    }

    function boundaries(viewMode){
        return {
            min: viewMode === 'F' ? celsiusToFahrenheit(min) : min,
            max: viewMode === 'F' ? celsiusToFahrenheit(max) : max
        };
    }

    function generateTicks(viewMode){
        var b = boundaries(viewMode);
        var ticks = [];
        for(var i=b.min; i<b.max; i+=step){
            ticks.push(i);
        }
        return ticks;
    }

    function getTemperaturePercentage(temperature, viewMode){
        var b = boundaries(viewMode);
        return ( (temperature - b.min) / (b.max - b.min) ) * 100;
    }

    function getTemperature (viewMode) {
        viewMode = viewMode ? viewMode : defaultViewMode;
        var finalTemperatue = finalizeTemperature(viewMode);
        return {
            temperature: {
                value : finalTemperatue,
                percentage: getTemperaturePercentage(finalTemperatue, viewMode)
            },
            boundaries: boundaries(viewMode),
            ticks: generateTicks(viewMode),
            viewMode: viewMode,
            isPositive: finalTemperatue > 0
        };
    }

    return {
        getTemperature: getTemperature,
        step: step
    };
});angular.module('edp.thermo').component('edpThermo', {
    restrict: 'E',
    replace: true,
    scope: {},
    templateUrl: 'modules/core/thermo/thermo.tpl.html',
    controller: function ($interval, ThermoService) {
        var model = this;
        var prevTemperature;

        model.direction = true;
        model.showDirecton = false;

        init();

        //Pretend this is the socket or whatever
        $interval(function() {
            init();
        }, 3000);

        function init() {
            model.tObj = ThermoService.getTemperature(model.viewMode);

            if (!prevTemperature) {
                model.showDirecton = true;
                prevTemperature = model.tObj.temperature.value;
            } else {
                model.showDirecton = false;
                if (!inRange(prevTemperature, model.tObj.temperature.value)) {
                    model.showDirecton = true;
                    if (model.tObj.temperature.value > prevTemperature && !model.boiling) {
                        model.boiling = true;
                    } else if (model.tObj.temperature.value < prevTemperature && model.boiling) {
                        model.boiling = false;
                    }
                }

                prevTemperature = model.tObj.temperature.value;
            }

            model.temperatureClass = model.tObj.isPositive ? 'positive' : 'negative';
            model.temperatureStatusClass = model.boiling ? 'boiling' : 'freezing';
            if (!model.showDirecton) {
                model.temperatureStatusClass += ' inRange';
            }

            model.temperatureStyle = {
                tick : {
                    width: (100 / model.tObj.ticks.length) + '%'
                },
                line: {
                    width: model.tObj.temperature.percentage + '%'
                }
            };
        }

        function inRange(oldValue, newValue){
            return Math.abs(oldValue - newValue) <= ThermoService.step;
        }
    },
    controllerAs: 'edpThermoModel',
    bindings: {
        viewMode: '@',
    },
});angular.module('edp.converters', []);angular.module('edp.converters').filter('temperature', function(){
    return function(number, type){
        if(isNaN(number)){
            return number;
        } else {
            return number + (type.toUpperCase() === 'C' ? '℃' : '℉');
        }
    }
});angular.module('edp', [
    'edp.converters',
    'edp.thermo'
]);
