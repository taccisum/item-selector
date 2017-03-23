(function () {
    itemSelector.define("util", function () {
        var count = 1;
        return {
            generateId: function () {
                return count++;
            }
        };
    });
})();
