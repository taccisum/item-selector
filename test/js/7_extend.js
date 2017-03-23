(function ($) {
    var core = itemSelector.require("core");
    $.fn.extend({
        "itemSelector": function (options) {
            if (options) {
                core.call(this, options);
            } else {
                core.call(this, {});
            }
        }
    });
})(jQuery);
