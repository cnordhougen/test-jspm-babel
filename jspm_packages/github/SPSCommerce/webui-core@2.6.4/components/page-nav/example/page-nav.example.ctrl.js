var items = [
    {state: 'overview', name: 'Overview'},
    {state: 'dashboard', name: 'Dashboard'},
    {state: 'favorites', name: 'Favorites'},
    {state: 'people', name: 'People'},
    {url: 'https://spscommerce.github.io/webui-pattern-library/', name: 'Pattern Library'}
];

module.exports = PageNavExample;

PageNavExample.$inject = ['pageNavService'];

function PageNavExample(pageNavService) {

    var _this = this;

    this.navItems = items;

    this.addItem = function (item) {
        pageNavService.addItem(item);
        _this.item = null;
    };

    this.removeItem = pageNavService.removeItem;
}
