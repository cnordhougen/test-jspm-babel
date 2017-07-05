var angular = require('angular');

module.exports = function PageNavService() {

    var _this = this;

    _this.items = [];

    return {
        addItem: addItem,
        setItems: setItems,
        removeItem: removeItem
    };

    function setItems(items) {
        if (items) {
            _this.items = items;
        }
        return items;
    }

    function addItem(value) {

        if (!value) {
            throw new Error('navigation menu item should be specified in order added to navigation');
        }

        if (angular.isArray(value)) {
            angular.forEach(value, function (item) {
                _this.items.push(item);
            });
        } else {
            _this.items.push(value);
        }
    }

    function removeItem(value) {

        if (!value && value !== 0) {
            throw new Error('item index or actual navigation menu item should be specified in order to be deleted');
        }

        var index = -1;

        if (angular.isNumber(value)) {
            if (_this.items.length <= value || value < 0) {
                throw new Error('item index out of menu items collection range');
            }

            index = value;
        } else {
            for (var i = 0, count = _this.items.length; i < count; i++) {
                if ((value.state && value.state === _this.items[i].state) || (value.url && value.url === _this.items[i].url)) {
                    index = i;
                    break;
                }
            }
        }

        if (index === -1) {
            throw new Error('unable to find specified item in menu items collection');
        }

        _this.items.splice(value, 1);
    }
};
