var app = angular.module('CucumberFancyReport', ['ui.bootstrap']);

app.controller('ReportCtrl', function ($scope, $filter, $http) {
    var config = {
        columns: [
            {name: "name", display: "ツ", main: true},
            {name: "duration", display: "Duration"},
            {name: "scenarios", display: "Scenarios"},
            {name: "skipped", display: "Skipped"},
            {name: "failed", display: "Failed"},
            {name: "total", display: "Total"}
        ]
    };


    $scope.selectFeature = function (feature) {
        feature.isSelected = true;
        $scope.selectedFeature = feature.payload;
        $scope.isFeatureSelected = true;
    };
    $scope.deselectFeature = function () {
        $scope.isFeatureSelected = false;
        //$scope.selectedFeature.isSelected = false;
    };

    $scope.getColumns = function () {
        return $scope.isFeatureSelected ?
            config.columns.filter(function (column) {
                return column.main;
            }) :
            config.columns;
    };

    $scope.reflectFeatureStatus = function (feature) {
        var clazz = feature.isSelected ? "" : "";

        if (feature.failed) {
            return clazz + " failed";
        }
        if (feature.skipped) {
            return clazz + " skipped";
        }
        return clazz;
    };

    $scope.storage = {
        features: []
    };

    $scope.getScenariosPointers = function (scenarios) {
        if (!$scope.isFeatureSelected) {
            return [];
        }
        var pointers = [];
        scenarios.forEach(function (scenario, index) {
            if (scenario.type == "scenario_outline") {
                pointers.push(index)
            }
        });
        return pointers;
    };

    var ScenarioDetails = function (name, steps) {
        var duration = 0;
        var failed = 0;
        var skipped = 0;
        var total = steps.length;

        steps.forEach(function (step) {
            var result = step.result;
            duration += result.duration || 0;
            if (result.status == "failed") {
                failed++;
            } else if (result.status == "undefined") {
                skipped++;
            }
        });

        this.toJson = {name: name, duration: duration, failed: failed, skipped: skipped, total: total}
    };

    var FeatureDetails = function (feature, scenarios) {
        var duration = 0;
        var failed = 0;
        var skipped = 0;
        var total = scenarios.length;
        var parent = "root";
        var id = feature.uri;

        (function calculateHierarchy(uri) {
            var parts = uri.split("/");
            if (parts.length > 1) {
                parent = parts[parts.length - 2];
                id = parts[parts.length - 1];
            } else {
                parent = "root";
                id = uri;
            }
        })(feature.uri);

        scenarios.forEach(function (scenario) {
            duration += scenario.duration;
            failed += scenario.failed;
            skipped += scenario.skipped;
        });

        var reduceScenarios = function (feature) {
            var elements = feature.elements,
                scenarios = [];
            for (var i = 0, n = elements.length; i < n; i++) {
                if (elements[i].type == "scenario_outline") {
                    var scenarioOutline = elements[i],
                        exampleRows = scenarioOutline.examples[0].rows;
                    for (var j = 1, m = exampleRows.length; j < m; j++) {
                        exampleRows[j].scenario = elements[i + j];
                    }
                    scenarios.push(scenarioOutline);
                    i += exampleRows.length - 1;
                } else {
                    scenarios.push(elements[i]);
                }
            }
            return scenarios;
        };
        feature.scenarios = reduceScenarios(feature);

        this.toJson = {
            name: feature.name,
            duration: duration / 1000000,
            scenarios: scenarios.length,
            failed: failed,
            skipped: skipped,
            total: total,
            payload: feature
        }
    };

    console.log("welcome to my world");

    $http.get('pretty-json.json').success(function (features) {
        var storage = {};

        features.map(function (feature) {
            var toHierarchicalView = function (uri, featureDetails) {
                var levels = uri.split("/"),
                    currentLevel = storage;

                for (var i = 0; i < levels.length - 1; i++) {
                    if (!currentLevel[levels[i]]) {
                        currentLevel[levels[i]] = {};
                    }
                    currentLevel = currentLevel[levels[i]];
                }
                if (currentLevel.children === undefined) {
                    currentLevel.children = [];
                }
                currentLevel.children.push(featureDetails)
            };

            var scenarios = feature.elements.map(function (scenario) {
                if (scenario.type == "scenario") {
                    return new ScenarioDetails(scenario.name, scenario.steps).toJson;
                }
                return "";
            }).filter(function (e) {
                return e != "";
            });

            var featureDetails = new FeatureDetails(feature, scenarios).toJson;
            toHierarchicalView(feature.uri, featureDetails)
        });


        var items = [];
        var toFlatView = function (storage, index) {
            var parentFeature = function (name, level) {
                return {
                    name: name,
                    level: level,
                    parent: true,
                    duration: "",
                    failed: "",
                    skipped: "",
                    total: ""
                }
            };

            for (var key in storage) {
                if (key != "children" && key != "level") {
                    items.push(parentFeature(key, index));
                    toFlatView(storage[key], index + 1)
                }
            }

            var children = storage.children || [];
            items = items.concat(children.map(function (child) {
                child.level = index + 1;
                return child;
            }));
        };

        toFlatView(storage, 0);
        console.log(items);

        $scope.storage.features = items;
    }).error(function (error, status) {
        alert(error + "\n" + status);
    });

})
;