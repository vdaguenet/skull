'use strict';

module.exports = {
    random: function(min, max) {
        return Math.random() * (max - min) + min;
    },
    average: function(array) {
        var sum = 0;

        for (var i = 0, j = array.length; i < j; i++) {
            sum += array[i];
        }

        return sum / j;
    },
    inherit: function(Child, Parent) {
        function Inter() {
        }
        Inter.prototype = Parent.prototype;
        Child.prototype = new Inter();
        Child.prototype.constructor = Child;
    },
    removeChildNodes: function(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    }
};