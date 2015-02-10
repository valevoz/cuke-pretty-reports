var app = angular.module('CucumberFancyReport', ['ui.bootstrap', 'ngSanitize']);

app.filter('highlightPlaceholder', function () {
    return function (item) {
        return item.replace(/<(.*?)>/igm, function (match) {
            return "<span class='placeholder'>" + match.replace(/>/g, "&gt;").replace(/</g, "&lt;") + "</span>"
        });
    };
});

app.filter('highlightStepPlaceholder', function () {
    return function (step) {
        var highlightedStep = step.name;
        if (step.match && step.match.arguments) {
            for (var i = step.match.arguments.length - 1; i >= 0; i--) {
                var arg = step.match.arguments[i],
                    val = "<span class='placeholder'>" + arg.val + "</span>";
                highlightedStep = highlightedStep.substring(0, arg.offset) + val + highlightedStep.substring(arg.offset + arg.val.length);
            }
        }
        return highlightedStep;
    };
});
app.filter('capitalize', function () {
    return function (name) {
        var words = name.match(/[A-Za-z][a-z]*/g);

        return words.map(capitalize).join(" ");

        function capitalize(word) {
            return word.charAt(0).toUpperCase() + word.substring(1);
        }
    };
});

app.controller('ReportCtrl', function ($scope, $filter, $http) {
    var config = {
        columns: [
            {name: "name", display: "ツ", main: true},
            {name: "total", display: "Total Σ"},
            {name: "passed", display: "Passed ☼"},
            {name: "failed", display: "Failed ☁"},
            {name: "skipped", display: "Skipped ❄"},
            {name: "duration", display: "Duration ⌚"}
        ]
    };


    $scope.selectFeature = function (feature) {
        if (feature.parent) {
            return;
        }
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
            })
            :
            config.columns;
    };

    $scope.reflectFeatureStatus = function (feature) {
        if (feature.parent) {
            return "";
        }
        var clazz = "passed";
        if (feature.failed) {
            clazz = "failed";
        } else if (feature.skipped) {
            clazz = "skipped";
        }
        clazz += " pointer";
        return clazz;
    };

    $scope.toggleStep = function (rows, index) {
        var isOpen = rows[index].isOpen;
        if (index == 0) {
            rows.forEach(function (row) {
                row.isOpen = !isOpen;
            });
        } else {
            rows[index].isOpen = !isOpen;
        }
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
        var passed = 0;
        var skipped = 0;
        var total = steps.length;

        steps.forEach(function (step) {
            var result = step.result;
            duration += result.duration || 0;
            if (result.status == "passed") {
                passed++;
            } else if (result.status == "failed") {
                failed++;
            } else if (result.status == "undefined" || result.status == "skipped") {
                skipped++;
            }
        });

        this.toJson = {name: name, duration: duration, passed: passed, failed: failed, skipped: skipped, total: total}
    };

    var FeatureDetails = function (feature, scenarios) {
        var total = 0;
        var passed = 0;
        var failed = 0;
        var skipped = 0;
        var duration = 0;
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
            total += scenario.total;
            passed += scenario.passed;
            failed += scenario.failed;
            skipped += scenario.skipped;
            duration += scenario.duration;
        });

        //TODO refactor
        var reduceScenarios = function (feature) {
            if (!(feature.elements && feature.elements.length)) {
                return [];
            }
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
            duration: parseFloat(duration / 1000000).toFixed(2),
            passed: passed,
            failed: failed,
            skipped: skipped,
            total: total,
            payload: feature
        }
    };

    console.log("welcome to my world");

    $http.get('/cucumber-reporting/cucumber-fancy-reporting/target/pretty-json.json').success(function (features) {
        var storage = {};
        features.map(function (feature) {
            var toHierarchicalView = function (uri, featureDetails) {
                var levels = uri.split("/"),
                    currentLevel = storage;

                for (var i = 0; i < levels.length - 1; i++) {
                    if (!currentLevel[levels[i]]) {
                        currentLevel[levels[i]] = {};
                        currentLevel[levels[i]].children = [];
                        currentLevel[levels[i]].details = {
                            total: 0,
                            failed: 0,
                            passed: 0,
                            skipped: 0,
                            duration: 0
                        };
                    }
                    currentLevel = currentLevel[levels[i]];
                    currentLevel.details = {
                        total: currentLevel.details.total + featureDetails.total,
                        passed: currentLevel.details.passed + featureDetails.passed,
                        failed: currentLevel.details.failed + featureDetails.failed,
                        skipped: currentLevel.details.skipped + featureDetails.skipped,
                        duration: currentLevel.details.duration + parseFloat(featureDetails.duration)
                    };
                }

                currentLevel.children.push(featureDetails)
            };

            var scenarios = [];
            if (feature.elements && feature.elements.length) {
                feature.elements.map(function (scenario) {
                    if (scenario.type == "scenario") {
                        scenarios.push(new ScenarioDetails(scenario.name, scenario.steps).toJson);
                    }
                });
            }

            var featureDetails = new FeatureDetails(feature, scenarios).toJson;
            toHierarchicalView(feature.uri, featureDetails)
        });

        console.log(storage);

        var items = [];
        var toFlatView = function (storage, index) {
            var parentFeature = function (details, name, level) {
                return {
                    name: name,
                    level: level,
                    parent: true,
                    total: details.total,
                    passed: details.passed,
                    failed: details.failed,
                    skipped: details.skipped,
                    duration: parseFloat(details.duration).toFixed(2)
                };
            };

            for (var key in storage) {
                if (storage.hasOwnProperty(key) && key != "children" && key != "details") {
                    items.push(parentFeature(storage[key]["details"], key, index));
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
        alert("Source JSON file not found.");
        console.log(error);
        console.log(status);
        $scope.storage.features = [];
    });

})
;