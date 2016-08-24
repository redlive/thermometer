angular.module('edp.thermo').factory('ThermoService', function() {
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
});