module.exports = function SidebarAppPrefsController($state, sidebarService, pageTitleService){

    var vm = this;
    vm.whereToGoBack = 'applications';

    // to make things interesting, I'll toggle the nav when you get here
    sidebarService.closeNav();

    pageTitleService.showBack = true;
    pageTitleService.backFunction = function (){
        // here's how you'd handle if it if the back button might do something different
        // based on some state inside this view

        $state.go(vm.whereToGoBack);
    };
};
