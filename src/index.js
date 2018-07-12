'use strict';

(function () {
    var app = {};

    if (APP_DEBUG) {
        window.app = app;
    }

    var listConfig = {
        itemsPerPage: 25,
        itemsPerRow: 5
    };

    var apiConfig = {
        apiKey: '1e30d670196cc0a097430d800cd8b05a',
        perPage: listConfig.itemsPerPage
    };


    //HACK. I know it's a bad practice...
    Object.defineProperty(Array.prototype, 'chunk', {
        value: function(chunkSize) {
            var R = [];
            for (var i=0; i<this.length; i+=chunkSize)
                R.push(this.slice(i,i+chunkSize));
            return R;
        }
    });

    if(typeof Promise === "undefined" && Promise.toString().indexOf("[native code]") === -1){
        ES6Promise.polyfill();
    }

    app.flickrApiProvider = new FlickrApiProvider(apiConfig);

    app.listModel = new PhotoListModel(listConfig.itemsPerPage, listConfig.itemsPerRow);
    app.listView = new PhotoListView(document.getElementById('main_area'));
    app.listController = new PhotoListController(app.listModel, app.listView);

})();