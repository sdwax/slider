(function($){

    $.prototype.animator = function () {
        return this.each(function () {
            var node = $(this);

            animator({
                node: node,
                effects: getEffects(node),
                ease: getEase(node),
                time: node.data('time'),
                start: node.data('start')
            });
        });
    };

    function animator(options) {
        var node = options.node;

        if (node.hasClass('group-effect')) {
            var interval = node.data('interval'),
                i = 0,
                start = node.data('start');

            node.children().each(function () {
                var ops = $.extend({}, options);
                ops.node = $(this);
                ops.start = options.start + start + interval * i++;
                animator(ops);
            });

            return;
        }

        var properties = getPropertiesForEffects(node, options.effects);

        prepareForEffects(node, options.effects);

        setTimeout(function () {
            animate(node, properties, options.time, options.ease)
        }, options.start);
    }

    function animate(node, props, time, ease) {
        if (css3()) {
            node.css('transition-time', time);
            node.css('transition-ease', ease);
            node.css(props);
        }
        else {
            node.animate(props, time, ease);
        }
    }

    //region============ Utils ====================

    $.animator = {};

    var effects = $.animator.effects = {
        'effect-left-to-right': {
            properties: ['left'],
            prepare: function(node){
                node.css('left', -node.outerWidth() + 'px');
            }
        },

        'effect-fade-in': {
            properties: ['opacity'],
            prepare: function(node){
                node.css('opacity', 0);
            }
        }
    };

    var getEffects = classNames('effect-'),
        getEases   = classNames('ease-');

    function getEase(node){
        return toCamel(getEases(node)[0]);
    }

    function getPropertiesForEffects(node, effectsList){
        var fields = [];
        for (var i = 0, len = effectsList.length; i < len; i++) {
            var effectName = effectsList[i];
            fields = fields.concat(effects[effectName].properties);
        }

        return node.css(fields);
    }

    function prepareForEffects(node, effectsList){
        for (var i = 0, len = effectsList.length; i < len; i++) {
            var effectName = effectsList[i];
            effects[effectName].prepare(node);
        }

        return this;
    }

    function classNames(prefics) {
        var reg = new RegExp('\\b'+prefics+'[-\\w]+', 'g');
        return function (element) {
            return element.prop('className').match(reg);
        }
    }

    function toCamel(str) {
        return str.replace(/-(\w)/g, function (full, char) {
            return char.toUpperCase();
        });
    }

    //endregion

})(jQuery);