
module.exports = {

    id: '',
    cmd: '',
    body: '',
    legacy: '',
    response: '',

    parse: function() {},

    setContext: function() {},

    sendTo: function() {
        return {
            onResponse: function() {}
        };
    }

};
