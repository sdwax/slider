(function($){

    var defaults = {
        itemSelector: '.item'
    };

    $.prototype.animator = function (options) {
        options = $.extend({}, defaults, options || {});

        return this.each(function () {
            var root = $(this);

            root.find(options.itemSelector).each(function () {
                var node = $(this),
                    properties = {},
                    easing = toCamel(getClassName(node, 'ease-')[0]),
                    effects = getClassName(node, 'effect-');

                for (var i = 0, len = effects.length; i < len; i++) {
                    switch (effects[i]) {
                        case 'effect-left-to-right':
                            properties.left = node.css('left');
                            node.css('left', -node.outerWidth() + 'px');
                            break;
                        case 'effect-fade-in':
                            properties.opacity = node.css('opacity');
                            node.css('opacity', 0);
                            break;
                    }
                }

                setTimeout(function () {
                    node.animate(properties, node.data('time'), easing);
                }, node.data('start'));
            });
        });
    };

    function getClassName(element, prefics) {
        return $(element).attr('class').match(new RegExp('\\b'+prefics+'[-\\w]+', 'g'));
    }

    function toCamel(str) {
        return str.replace(/-(\w)/g, function (full, char) {
            return char.toUpperCase();
        });
    }

})(jQuery);