/**
 * @function sidebarService
 * @memberOf spsui.sidebar
 * @description Sidebar logic and exposed integration points
 */

    var angular = require('angular');

    module.exports = SidebarService;

    SidebarService.$inject = ['$q', '$http', '$document', '$window'];

    /**
     * function for sidebar service
     * @param $q
     * @param $http
     * @param $document
     * @param $window
     * @returns {{}}
     */
    function SidebarService ($q, $http,  $document, $window) {

        var service = {};
        var itemsArray = [];
        var desktopNavOpened = true;

        /**
         *
         * @param jsonFile
         * @returns {*}
         */
        service.fetchJson = function (jsonFile) {
            var deferred = $q.defer();
            var returnObj = {};
            $http.get(jsonFile).then(function (response) {
                service.itemsArray = response.data.items;
                returnObj.items = service.itemsArray;
                if(response.data.title){
                    service.title = response.data.title;
                    returnObj.title = service.title;
                }
                deferred.resolve(returnObj);
            }, function (error) {
                var errorMsg = error || '';
                deferred.reject({
                    msg: 'error',
                    status: errorMsg
                });
            });
            return deferred.promise;
        };

        /**
         * used passed object to set navigation items
         * @param passedInItems
         * @returns {Array}
         */
        service.setItems = function (passedInItems) {
            itemsArray = passedInItems;
            return itemsArray;
        };

        /**
         * add item to navigation items
         * @param {object} item
         */
        service.addItem = function (item) {
            itemsArray.push(item);
        };

        /**
         * remove item from navigation items
         * @param {object} item
         */
        service.removeItem = function (item) {
            var itemsLength,
                itemIdx = 'unset';
            itemsLength = itemsArray.length;
            for (var i = 0; i < itemsLength; i += 1) {
                if (item.id === itemsArray[i].id && item.displayName === itemsArray[i].displayName) {
                    itemIdx = i;
                    break;
                }
            }
            if (itemIdx !== 'unset') {
                itemsArray.splice(itemIdx, 1);
            }

        };

        /**
         * toggle `no-nav` class on body tag
         */

       service.toggleNav = function () {

            if (!desktopNavOpened) {
                service.openNav();
            } else {
                service.closeNav();
            }

           return desktopNavOpened;
        };

        // adds no-nav class to body
        service.closeNav = function(){
            $document.find('body').addClass('no-nav');
            desktopNavOpened = false;
        };

        // removes no-nav class on body
        service.openNav = function(){
            $document.find('body').removeClass('no-nav');
            desktopNavOpened = true;
        };

        /**
         * add `breakpoint-triggered` on body tag and sets min-height on inner-wrap
         */
        service.setMobileLayout = function(){
            angular.element($document[0].querySelector('.inner-wrap')).attr('style','min-height:'+$window.innerHeight+'px;');
            $document.find('body').addClass('breakpoint-triggered');
        };


        /**
         * remove `breakpoint-triggered` on body tag and removes min-height on inner-wrap
         */
        service.setDesktopLayout = function(){
            $document.find('body').removeClass('breakpoint-triggered');
            angular.element($document[0].querySelector('.inner-wrap')).css('min-height', '');
        };

        /**
         * closes off-canvas when clicked outside off-canvas.
         * adds click handler to all window elements other than
         * sidebar-module and left-off-canvas. Only fires when
         * off-canvas is visible
         */
        service.enableClickOut = function enableClickOut(){
            $window.onclick = function clickOutHandler(event){
                var target = event.target;
                var activeOffCanvas = document.getElementsByClassName('move-right');
                if(angular.element(target).hasClass('sidebar-module') || angular.element(target).hasClass('left-off-canvas-toggle') || activeOffCanvas.length === 0){
                    return;
                }
                service.removeOffCanvas();
            };
        };

        /**
         * removes the click outside off-canvas click handler
         */
        service.disableClickOut = function disableClickOut(){
            $window.onclick = null;
        };

        /**
         * closes off-canvas
         */
        service.removeOffCanvas = function (){
            var offCanvas = document.getElementsByClassName('off-canvas-wrap');

            angular.element(offCanvas).removeClass('move-right');
        };

        /**
         * run both {@link service.runBreakpoint} and
         * {@link service.toggle} (used during directive init)
         * @param {boolean} breakpointTriggered
         */
        service.init = function (breakpointTriggered) {
            if(breakpointTriggered){
                service.setMobileLayout();
            } else {
                service.setDesktopLayout();
            }
            //TODO: add local storage to remember nav state on desktop views
        };

        service.itemsArray = itemsArray;
        return service;
    }
