'use strict';

var PhotoListModel = (function () {

    var _itemsPerPage, _itemsPerRow;

    var currentList = [];
    var nextPageList = [];
    var prevPageList = [];

    var currentPage = 1;
    var currentRowIndex = 0;
    var currentItemIndex = 0;

    var _normalRowsCount;
    var _preLastRowIndex;

    var _event_activeRowChanged, _event_activeItemChanged;

    function PhotoListModel (itemsPerPage, itemsPerRow) {
        var context = this;
        this.api = app.flickrApiProvider;

        this._event_listChanged = new SimpleEvent(true);
        this.onListChanged = function (handler) {
            this._event_listChanged.subscribe(handler);
        };

        _event_activeRowChanged = new SimpleEvent(true);
        this.onActiveRowChanged = function (handler) {
            _event_activeRowChanged.subscribe(handler);
        };

        _event_activeItemChanged = new SimpleEvent(true);
        this.onActiveItemChanged = function (handler) {
            _event_activeItemChanged.subscribe(handler);
        };

        _itemsPerPage = itemsPerPage;
        _itemsPerRow = itemsPerRow;

        _normalRowsCount = ~~(itemsPerPage / itemsPerRow);
        _preLastRowIndex = _normalRowsCount - 2; // last index minus 1

        this.api.get(currentPage).then(function (serverData) {
            currentList = serverData['photos']['photo'].chunk(5);
            return currentList;
        }).then(function(currentList) {
            context._event_listChanged.fire(currentList);
            _event_activeRowChanged.fire({old: currentRowIndex, new: currentRowIndex});
            _event_activeItemChanged.fire({old: currentItemIndex, new: currentItemIndex});
        });
        // currentList = currentListMock.chunk(5);

        console.log('[app] INIT: PhotoListModel');
    }

    PhotoListModel.prototype.goNextItem = function () {
        if (currentItemIndex >= 0 && currentItemIndex < _itemsPerRow - 1) {
            itemIndexChange(currentItemIndex, currentItemIndex + 1);
        } else if (currentItemIndex === _itemsPerRow - 1 && currentRowIndex < _normalRowsCount - 1) {
            itemIndexChange(currentItemIndex, 0);
            this.goNextRow();
            //rowIndexChange(currentRowIndex, currentRowIndex + 1);
        }
    };

    PhotoListModel.prototype.goPrevItem = function () {
        if (currentItemIndex > 0 && currentItemIndex <= _itemsPerRow - 1) {
            itemIndexChange(currentItemIndex, currentItemIndex - 1);
        } else if (currentItemIndex === 0 && currentRowIndex !== 0) {
            itemIndexChange(currentItemIndex, _itemsPerRow - 1);
            this.goPrevRow();
            //rowIndexChange(currentRowIndex, currentRowIndex - 1);
        }
    };

    PhotoListModel.prototype.goNextRow = function () {
        var context = this;

        if (currentRowIndex >= 0 && currentRowIndex < _normalRowsCount - 1) {

            rowIndexChange(currentRowIndex, currentRowIndex + 1);

            if (prevPageList.length > _normalRowsCount) {
                prevPageList.splice(0, prevPageList.length - _normalRowsCount);
            }

            if (currentRowIndex >= _preLastRowIndex) {
                if (nextPageList.length === 0) {
                    currentPage += 1;
                    prevPageList.length = 0;
                    this.api.get(currentPage).then(function (serverData) {
                        nextPageList = serverData['photos']['photo'].chunk(5);
                        return true;
                    }).then(function (status) {
                        shiftListDown(currentRowIndex - 1);
                        context._event_listChanged.fire(currentList);
                    });
                    // nextPageList = nextPageListMock.chunk(5);
                } else {
                    shiftListDown(currentRowIndex - 1);
                    context._event_listChanged.fire(currentList);
                }
            }
        }
    };

    PhotoListModel.prototype.goPrevRow = function () {
        var context = this;

        if (currentRowIndex > 0 && currentRowIndex < _normalRowsCount) {
            rowIndexChange(currentRowIndex, currentRowIndex - 1);
            if (currentRowIndex <= 1 /*&& nextPageList.length < _normalRowsCount*/) {
                if (prevPageList.length === 0 && currentPage !== 1) {
                    currentPage -= 1;
                    nextPageList.length = 0;
                    this.api.get(currentPage).then(function (serverData) {
                        prevPageList = serverData['photos']['photo'].chunk(5);
                        return true;
                    }).then(function (status) {
                        shiftListUp(_normalRowsCount - (currentRowIndex + 1));
                        context._event_listChanged.fire(currentList);
                    });
                // } else if (currentPage === 1 && currentRowIndex <= 1) {
                //     return;
                } else {
                    shiftListUp(_normalRowsCount - (currentRowIndex + 1));
                    context._event_listChanged.fire(currentList);
                }
            }
        }
    };


    function itemIndexChange(oldValue, newValue) {
        currentItemIndex = newValue;

        _event_activeItemChanged.fire({old: oldValue, new: newValue});

        console.log('Item: ' + currentItemIndex + ' in row: ' + currentRowIndex + '. Data: ' + currentList[currentRowIndex][currentItemIndex].id);
    }

    function rowIndexChange(oldValue, newValue) {
        currentRowIndex = newValue;

        _event_activeRowChanged.fire({old: oldValue, new: newValue});

        console.log('Item: ' + currentItemIndex + ' in row: ' + currentRowIndex + '. Data: ' + currentList[currentRowIndex][currentItemIndex].id);
    }

    function shiftListDown(numberOfRows) {
        if (nextPageList.length < numberOfRows) numberOfRows = nextPageList.length;

        prevPageList = prevPageList.concat(currentList.splice(0, numberOfRows));
        currentList = currentList.concat(nextPageList.splice(0, numberOfRows));

        rowIndexChange(currentRowIndex, currentRowIndex - numberOfRows);

    }

    function shiftListUp(numberOfRows) {
        if (prevPageList.length < numberOfRows) numberOfRows = prevPageList.length;

        nextPageList = currentList.splice(numberOfRows * -1, 9e9).concat(nextPageList);
        currentList = prevPageList.splice(numberOfRows * -1, 9e9).concat(currentList);

        rowIndexChange(currentRowIndex, _preLastRowIndex);
    }

    return PhotoListModel;

})();