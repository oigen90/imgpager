'use strict';

var FlickrApiProvider = (function () {

    var _baseUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key={API_KEY}&format=json&nojsoncallback=?&tags=ukraine&page={PAGE_NUMBER}&per_page={PER_PAGE}&extras=url_m';

    var FlickrApiProvider = function (apiConfig) {
        _baseUrl = _baseUrl.replace('{API_KEY}', apiConfig.apiKey)
                           .replace('{PER_PAGE}', apiConfig.perPage);

        console.log('[app] INIT: FlickrApiProvider');
    };

    FlickrApiProvider.prototype.get = function (pageNumber) {
        var url = _baseUrl.replace('{PAGE_NUMBER}', pageNumber);

        return _sendRequest(url)
            .then(function (result) {
                console.log('FlickrApiProvider request.get [OK] ', url);
                return result;
            }, function (error) {
                console.log('FlickrApiProvider request.get [ERROR] ', JSON.stringify(error));
                return error;
            });

    };

    function _sendRequest (url) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'json';

            request.onload = function () {
                resolve(request.response);
            };
            request.onerror = function (error) {
                console.log('FlickrApiProvider request.get [ERROR]: ', JSON.stringify(error));
                reject(error);
            };

            request.send();
        });
    }

    return FlickrApiProvider;

})();