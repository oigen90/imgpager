'use strict';

var PhotoListController = (function () {

    function PhotoListController (model, view) {
        var context = this;

        this.model = model;
        this.view = view;

        this.activeRow = 0;
        this.activeItem = 0;

        this._event_keyUp = new SimpleEvent(true);
        this.onKeyUp = function (handler) {
            this._event_keyUp.subscribe(handler);
        };

        // this.onKeyUp(function (keycode) {
        //     console.log('[FIRE]: ' + keycode);changeActiveRow
        // });

        registerClickEvents.call(this);

        context.model.onListChanged(function(newList) {
            context.view.render(newList);
        });
        context.model.onActiveItemChanged(function(itemData) {
            context.activeItem = itemData.newValue;
            context.view.changeActiveItem(itemData);
        });
        context.model.onActiveRowChanged(function(rowData) {
            context.activeRow = rowData.newValue;
            context.view.changeActiveRow(rowData);
        });

        console.log('[app] INIT: PhotoListController');
    }

    PhotoListController.prototype.makeMove = function(direction) {

    };

    function makeMove(keycode) {
        if (keycode === 37) {
            this.model.goPrevItem();
        } else if (keycode === 38) {
            this.model.goPrevRow();
        } else if (keycode === 39) {
            this.model.goNextItem();
        } else if (keycode === 40) {
            this.model.goNextRow();
        }
    }

    function registerClickEvents() {
        var context = this;

        window.addEventListener('keyup', function(e) {
            if (e.keyCode >= 37 && e.keyCode <= 40) {
                makeMove.call(context, e.keyCode);
                context._event_keyUp.fire(e.keyCode);

                e.preventDefault();
            }
        });
    }

    return PhotoListController;

})();