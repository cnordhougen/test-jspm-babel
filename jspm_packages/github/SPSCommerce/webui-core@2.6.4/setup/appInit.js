module.exports = AppInit;

AppInit.$inject = ['messageBus'];

function AppInit(messageBus) {
    messageBus.send('appInit', {
        modules: Object.keys(window.sps || {})
    });
}
