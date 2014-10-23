'use strict';

module.exports = {
    random: function(min, max) {
        return Math.random() * (max - min) + min;
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