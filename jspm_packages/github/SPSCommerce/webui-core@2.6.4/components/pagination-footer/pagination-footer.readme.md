## spsui-pagination-footer

| First Available 	| Lifecycle     | Screenshot    | Files |
|-----------------	|----------     |-----------    |------ |
| v2.4.0 	        | New           | [screenshot][pagination-footer-ss]           | [components/pagination-footer][pagination-footer] 	|

*This is a new feature. You are encouraged to use it and [report any issues you may find][issues].*

This component provides a standard set of pagination controls for lists or tables of data.

#### Usage

```javascript
function MyController() {

    var _this = this;

    _this.paginationApi = {};

    _this.searchAlbums = function () {
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
}
```

```html
<spsui-pagination-footer 
    api="ctrl.paginationApi" 
    size-options="[5, 25, 50]"
    on-ready="ctrl.paginationReady"
    on-change="ctrl.paginationChange">
</spsui-pagination-footer>
```

#### Attributes

| Attribute 	 | Type 	| Required | Description 	                                | Default 	|
|--------------- |---------	|--------- | ------------------------	                    |---------	|
| size-options 	     | array 	| no      | array of options for items per page	                  | 25	    |
| on-ready   | function  | no       | calls back when the pagination methods and state are ready   | - |
| on-change   | function  | no       | calls back when the page changes    | - |
| api | object   | no       | an object containing methods to control pagination and read-only current state properties	   | (view the code for details) 	    |

---

[pagination-footer]: https://github.com/SPSCommerce/webui-core/blob/master/core/components/pagination-footer
[pagination-footer-ss]: https://cloud.githubusercontent.com/assets/44441/13995133/e48bfc60-f0f5-11e5-81ef-741e2d5aeb5f.png
