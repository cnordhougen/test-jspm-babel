

module.exports = PaginationFooterExampleCtrl;

PaginationFooterExampleCtrl.$inject = ['$http', '$log'];

function PaginationFooterExampleCtrl($http, $log) {

    /*jshint validthis:true */
    var _this = this;

    _this.query = 'core';

    _this.totalAvailability = true;

    _this.paginationApi = {};

    _this.searchAlbums = function () {
        // https://developer.spotify.com/web-api/search-item/
        var url = 'https://api.spotify.com/v1/search?type=album&q=' + _this.query;
        url += '&limit=' + _this.paginationApi.state.pageSize;
        url += '&offset=' + _this.paginationApi.state.startIndex;
        $http.get(url).then(function (response) {
            _this.spotifyResponse = response.data;
            _this.total = _this.spotifyResponse.albums.total;
            if(_this.totalAvailability){
                _this.paginationApi.setTotalItems(_this.total);
            }
        });
    };

    _this.paginationReady = function(){
        _this.searchAlbums();
    };

    _this.paginationChange = function paginationChange(currentState, previousState) {
        if (currentState.pageNumber !== previousState.pageNumber) {
            $log.info('Changed from page ' + previousState.pageNumber + ' to ' + currentState.pageNumber);
        }

        if (currentState.pageSize !== previousState.pageSize) {
            $log.info('Changed from ' + previousState.pageSize + ' items per page to ' + currentState.pageSize);
        }

        _this.searchAlbums();
    };

    _this.gotoRandomPage = function () {
        var num = Math.floor(Math.random() * _this.paginationApi.state.totalPages) + 1;
        _this.paginationApi.setPageNumber(num);
    };

    _this.totalAvailabilityChange = function () {
        _this.paginationApi.setTotalItems(_this.totalAvailability ? _this.total : -1);
    };
}
