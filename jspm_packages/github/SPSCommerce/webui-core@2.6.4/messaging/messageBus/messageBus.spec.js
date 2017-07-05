var MessageBus = require('./messageBus');
var openWindow = require('test/utils/openWindow');
var windowMock = require('test/mocks/window.mock');

var spy;
var event;
var result;
var frame;
var bus;

var frameUrl = '/base/test/frames/event-frame/index.html';
var originUrl = 'http://localhost:9876';

function setupMock() {
    return openFrame().then(function (_frame) {
        bus = new MessageBus(_frame, windowMock);
    });
}

function setupReal() {
    return openFrame().then(function (_frame) {
        bus = new MessageBus(_frame);
        bus.allowOrigin(originUrl);
    });
}

function openFrame() {
    return openWindow(frameUrl).then(function (_frame) {
        frame = _frame;
        return frame;
    });
}

describe('messaging/messageBus', function () {

    afterEach(function () {
        if (frame && frame.close) {
            frame.close();
            frame = null;
        }
        spy = null;
        event = null;
        result = null;
        bus = null;
    });

    itAsync('should have on()', function() {
        return setupMock().then(function () {
            expect(bus).toHaveMethod('on');
        })
    });

    itAsync('should have send()', function() {
        return setupMock().then(function () {
            expect(bus).toHaveMethod('send');
        })
    });

    itAsync('should have trigger()', function() {
        return setupMock().then(function () {
            expect(bus).toHaveMethod('trigger');
        })
    });

    itAsync('should have destroy()', function() {
        return setupMock().then(function () {
            expect(bus).toHaveMethod('destroy');
        })
    });

    describe('on()', function() {

        itAsync('should create EventHandler when called', function() {
            return setupMock().then(function () {
                bus.on('foo');
                expect(bus.handlers).toBeNonEmptyObject();
                expect(bus.handlers['foo']).toBeObject();
            });
        });

        itAsync('should not overwrite EventHandler when called multiple times', function() {
            return setupMock().then(function () {
                var event1 = bus.on('foo');
                var event2 = bus.on('foo');
                expect(event1.handler).toEqual(event2.handler);
            });
        });

        itAsync('should register callback if one is provided', function() {
            return setupMock().then(function () {
                spy = jasmine.createSpy('cb');
                event = bus.on('foo', spy);
                expect(event.handler.callbacks).toBeArrayOfSize(1);
                expect(event.handler.callbacks[0]).toBe(spy);
            });
        });

        itAsync('should register multiple callbacks', function() {
            return setupMock().then(function () {
                var spy1 = jasmine.createSpy('cb1');
                var spy2 = jasmine.createSpy('cb2');
                var event1 = bus.on('foo', spy1);
                var event2 = bus.on('foo', spy2);
                expect(event1.handler.callbacks).toBeArrayOfSize(2);
                expect(event2.handler.callbacks).toBeArrayOfSize(2);
            });
        });

        itAsync('should remove callbacks via event.destroy()', function() {
            return setupMock().then(function () {
                spy = jasmine.createSpy('cb');
                event = bus.on('foo', spy);
                expect(event.handler.callbacks).toBeArrayOfSize(1);
                event.destroy();
                expect(event.handler.callbacks).toBeEmptyArray();
            });
        });

        describe('respondWith()', function() {

            itAsync('should register response callback', function() {
                return setupMock().then(function () {
                    spy = jasmine.createSpy('cb');
                    event = bus.on('foo');
                    event.respondWith('bar');
                    expect(event.handler.callbacks).toBeArrayOfSize(1);
                    expect(event.handler.callbacks[0]).toBeFunction();
                });
            });

            itAsync('should trigger response callback', function() {
                return setupMock().then(function () {
                    spy = jasmine.createSpy('cb');
                    event = bus.on('foo').respondWith(spy);
                    bus.trigger('foo', {body: 'bar'});
                    expect(spy).toHaveBeenCalledWith('bar', {body: 'bar'});
                });
            });
        });

    });

    describe('trigger()', function() {

        itAsync('should fire callback registered via on()', function() {
            return setupMock().then(function () {
                spy = jasmine.createSpy('cb');
                event = bus.on('foo', spy);
                bus.trigger('foo', {body: 'bar'});
                expect(spy).toHaveBeenCalledWith('bar', {body: 'bar'});
            });
        });

        itAsync('should fire multiple callbacks registered via on()', function() {
            return setupMock().then(function () {
                var spy1 = jasmine.createSpy('cb1');
                var spy2 = jasmine.createSpy('cb2');
                bus.on('foo', spy1);
                bus.on('foo', spy2);
                bus.trigger('foo', {body: 'bar'});
                expect(spy1).toHaveBeenCalledWith('bar', {body: 'bar'});
                expect(spy2).toHaveBeenCalledWith('bar', {body: 'bar'});
            });
        });

    });

    describe('destroy()', function() {

        itAsync('should remove callbacks from handlers', function() {
            return setupMock().then(function () {
                spy = jasmine.createSpy('cb');
                event = bus.on('foo', spy);
                expect(event.handler.callbacks).toBeArrayOfSize(1);
                bus.destroy();
                expect(event.handler.callbacks).toBeEmptyArray();
            });
        });

        itAsync('should remove all handlers', function() {
            return setupMock().then(function () {
                bus.on('foo');
                expect(bus.handlers).toBeNonEmptyObject();
                bus.destroy();
                expect(bus.handlers).toBeUndefined();
            });
        });

    });

});


describe('messaging/messageBus (real window tests)', function () {

    // These tests communicate with a test frame, found in:
    // test/frames/event-frame/index.html

    afterEach(function () {
        if (frame && frame.close) {
            frame.close();
            frame = null;
        }
        spy = null;
        event = null;
        result = null;
        bus = null;
    });

    itAsync('should trigger callback when receiving a message', function(done) {
        return setupReal().then(function () {
            spy = jasmine.createSpy('cb');
            event = bus.on('auto', spy);
            setTimeout(function () {
                expect(spy).toHaveBeenCalledWith('msg body', jasmine.any(Object));
                done();
            }, 500);
        });
    });

    itAsync('should trigger handler when response is received', function(done) {
        return setupReal().then(function () {
            spy = jasmine.createSpy('cb');
            bus.send('getChocolate').onResponse(spy);
            setTimeout(function () {
                expect(spy).toHaveBeenCalledWith('toblerone', jasmine.any(Object));
                done();
            }, 500);
        });
    });

    describe('respondWith()', function() {

        itAsync('should trigger callback when receiving a message', function(done) {
            return setupReal().then(function () {
                spy = jasmine.createSpy('cb');
                bus.on('auto').respondWith(spy);
                setTimeout(function () {
                    expect(spy).toHaveBeenCalled();
                    done();
                }, 500);
            });
        });

        itAsync('should support responding with a literal value', function(done) {
            return setupReal().then(function () {
                spy = jasmine.createSpy('cb');
                bus.on('auto').respondWith('babyruth');
                bus.on('response-ack', spy);
                setTimeout(function () {
                    expect(spy).toHaveBeenCalledWith('babyruth', jasmine.any(Object));
                    done();
                }, 500);
            });
        });

        itAsync('should support responding with a function', function(done) {
            return setupReal().then(function () {
                spy = jasmine.createSpy('cb');
                bus.on('auto').respondWith(function () {
                    return 'snickers';
                });
                bus.on('response-ack', spy);
                setTimeout(function () {
                    expect(spy).toHaveBeenCalledWith('snickers', jasmine.any(Object));
                    done();
                }, 500);
            });
        });

        itAsync('should support responding with a function that returns promise', function(done) {
            return setupReal().then(function () {
                spy = jasmine.createSpy('cb');
                bus.on('auto').respondWith(function () {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve('kitkat');
                        }, 100);
                    });
                });
                bus.on('response-ack', spy);
                setTimeout(function () {
                    expect(spy).toHaveBeenCalledWith('kitkat', jasmine.any(Object));
                    done();
                }, 500);
            });
        });

        itAsync('should support responding with a promise', function(done) {
            return setupReal().then(function () {
                spy = jasmine.createSpy('cb');
                bus.on('auto').respondWith(new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve('crunch');
                    }, 100);
                }));
                bus.on('response-ack', spy);
                setTimeout(function () {
                    expect(spy).toHaveBeenCalledWith('crunch', jasmine.any(Object));
                    done();
                }, 500);
            });
        });

    })


});
