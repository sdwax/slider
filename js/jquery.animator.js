(function($){

    $.prototype.animator = function () {
        return this.each(function () {
            var node = $(this),
                effectsList = getEffects(node),
                properties = getPropertiesForEffects(node, effectsList);

            prepareForEffects(node, effectsList);

            setTimeout(function () {
                node.animate(properties, node.data('time'), getEase(node));
            }, node.data('start'));
        });
    };

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
        var properties = {};

        for (var i = 0, len = effectsList.length; i < len; i++) {
            var effectName = effectsList[i];
            $.extend(properties, node.css(effects[effectName].properties));
        }

        return properties;
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

})(jQuery);