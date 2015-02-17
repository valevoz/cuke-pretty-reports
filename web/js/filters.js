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