angular.module('edp.thermo').component('edpThermo', {
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
                prevTemperature = model.tObj.temperature.value;
            } else {

                if (!inRange(prevTemperature, model.tObj.temperature.value)) {
                    model.showDirecton = true;
                    if (model.tObj.temperature.value > prevTemperature && !model.increased) {
                        model.boiling = true;
                    } else if (model.tObj.temperature.value < prevTemperature && model.increased) {
                        model.boiling = false;
                    }
                } else {
                    model.showDirecton = false;
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
});