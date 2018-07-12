/*!
 * @overview SimpleEvent
 */

var SimpleEvent = (function () {
    "use strict";

    var SimpleEvent = function (fireLastDataOnNewSubscribers) {
        this._fireLastDataOnNewSubscribers = fireLastDataOnNewSubscribers;
        this._handlers = [];
        this._lastData = undefined;
        this._lastDataExists = false;
    };
    SimpleEvent.prototype.fire = function (data) {
        this._lastData = data;
        this._lastDataExists = true;
        for (var i = 0; i < this._handlers.length; i++) {
            this._handlers[i](data);
        }
    };
    /**
     * subscribe
     * @param {function} handler
     */
    SimpleEvent.prototype.subscribe = function (handler) {
        this._handlers.push(handler);
        if (this._lastDataExists && this._fireLastDataOnNewSubscribers) {
            handler(this._lastData);
        }
        var that = this;
        return function () {
            var index = that._handlers.indexOf(handler);
            if (index > -1) {
                that._handlers.splice(index, 1);
            }
        }
    };

    return SimpleEvent;
})();