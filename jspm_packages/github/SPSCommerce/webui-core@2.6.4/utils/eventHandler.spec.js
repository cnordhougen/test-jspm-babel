require('test/harness');

var EventHandler = require('./eventHandler');

describe('utils/eventHandler.js', function(){

    var instance;
    var unregister;
    var spy1, spy2;
    var foo = 'foobar';

    afterEach(function() {
        instance = null;
        spy1 = null;
        spy2 = null;
    })

    beforeEach(function() {
        instance = new EventHandler();
        spy1 = jasmine.createSpy('spy1');
        spy2 = jasmine.createSpy('spy2');
    });

    it('should have register() method', function() {
        expect(instance).toHaveMethod('register');
    });

    it('should have trigger() method', function() {
        expect(instance).toHaveMethod('trigger');
    });

    it('should register handler without error', function() {
        expect(function() {
            instance.register();
        }).not.toThrow();
    });

    it('should return unregister function', function() {
        unregister = instance.register();
        expect(unregister).toBeFunction();
    });

    it('should trigger registered handler', function() {
        instance.register(spy1);
        instance.trigger('foo');
        expect(spy1).toHaveBeenCalledWith('foo');
    });

    it('should trigger registered handler with variable args', function() {
        instance.register(spy1);
        instance.trigger('foo', {ack: 'bar'}, 3.14);
        expect(spy1).toHaveBeenCalledWith('foo', {ack: 'bar'}, 3.14);
    });

    it('should trigger multiple registered handlers', function() {
        instance.register(spy1);
        instance.register(spy2);
        instance.trigger('foobar');
        expect(spy1).toHaveBeenCalledWith('foobar');
        expect(spy2).toHaveBeenCalledWith('foobar');
    });

    it('should unregister handler', function() {
        unregister = instance.register(spy1);
        instance.register(spy2);
        unregister();
        instance.trigger('foobar');
        expect(spy1).not.toHaveBeenCalled();
        expect(spy2).toHaveBeenCalledWith('foobar');
    });

    it('should remove all handlers via destroy()', function() {
        instance.register(spy1);
        instance.register(spy2);
        expect(instance.callbacks).toBeArrayOfSize(2);
        instance.destroy();
        expect(instance.callbacks).toBeEmptyArray();
    });

});
