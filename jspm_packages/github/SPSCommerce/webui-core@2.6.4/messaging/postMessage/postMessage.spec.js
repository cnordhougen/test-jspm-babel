var uid = require('webui-core/utils/uid');
var openWindow = require('test/utils/openWindow');
var windowMock = require('test/mocks/window.mock');
var PostMessage = require('./postMessage');

var spy;
var msg;
var result;
var remove;
var spyThen;
var spyCatch;
var spyPostMessage;
var frame;
var instance;

function getFrame() {
    return openWindow('/base/test/frames/event-frame/index.html').then(function (response) {
        frame = response;
        return frame;
    });
}

describe('messaging/postMessage', function() {

    beforeEach(function() {
        spyThen = jasmine.createSpy('then');
        spyCatch = jasmine.createSpy('catch');
    });

    afterEach(function() {
        // close any stray frame windows
        if (frame && frame.close) {
            frame.close();
            frame = null;
        }
        // clear any event stray listeners
        if (typeof remove === 'function') {
            remove();
        }
        spy = null;
        msg = null;
        result = null;
        remove = null;
        spyThen = null;
        spyCatch = null;
        instance = null;
    });

    it('should have static parse() method', function() {
        expect(PostMessage.parse).toBeFunction();
    });

    describe('parse()', function() {

        it('should json decode string', function() {
            var obj = {
                id: '123',
                cmd: 'foo',
                body: {
                    bar: 'baz'
                }
            };
            var json = JSON.stringify(obj);
            result = PostMessage.parse(json);
            expect(result).toEqual(obj);
        });

        it('should return message content even if json is invalid', function() {
            var obj = {
                id: '',
                cmd: '',
                body: '',
                legacy: false
            };
            result = PostMessage.parse('%%');
            expect(result).toEqual(obj);
        });
    });

    describe('instances', function() {

        beforeEach(function() {
            instance = new PostMessage({cmd: 'foo'});
            instance.setContext(windowMock);
        });

        it('should have id property', function() {
            expect(instance).toHaveNonEmptyString('id');
        });

        it('should have sendTo method', function() {
            expect(instance).toHaveMethod('sendTo');
        });

        describe('sendTo()', function() {

            itAsync('should send postMessage to the frame', function() {
                return getFrame().then(function (frame) {
                    spy = spyOn(frame, 'postMessage');
                    instance.sendTo(frame);
                    var json = JSON.stringify({
                        id: instance.id,
                        cmd: instance.cmd,
                        body: instance.body,
                        response: ''
                    });
                    expect(spy).toHaveBeenCalledWith(json, '*');
                });
            });

            itAsync('should provide interface with onResponse()', function() {
                return getFrame().then(function (frame) {
                    result = instance.sendTo(frame);
                    expect(result).toHaveMethod('onResponse');
                });
            });

            describe('onResponse()', function() {

                itAsync('should add post message event listener', function() {
                    return getFrame().then(function (frame) {
                        spy = spyOn(windowMock, 'addEventListener');
                        msg = instance.sendTo(frame);
                        expect(spy).not.toHaveBeenCalled();
                        remove = msg.onResponse(function() {});
                        expect(spy).toHaveBeenCalled();
                    });
                });

                itAsync('should return function to remove listener', function() {
                    return getFrame().then(function (frame) {
                        remove = instance.sendTo(frame).onResponse(function() {});
                        expect(remove).toBeFunction();
                    });
                });

                itAsync('should remove listener when called', function() {
                    return getFrame().then(function (frame) {
                        spy = spyOn(windowMock, 'removeEventListener');
                        remove = instance.sendTo(frame).onResponse(function() {});
                        expect(spy).not.toHaveBeenCalled();
                        remove();
                        expect(spy).toHaveBeenCalled();
                    });
                });

                itAsync('should not remove listener if timeout not specified', function(done) {
                    return getFrame().then(function (frame) {
                        spy = spyOn(windowMock, 'removeEventListener');
                        msg = instance.sendTo(frame);
                        remove = msg.onResponse(function() {});
                        setTimeout(function() {
                            expect(spy).not.toHaveBeenCalled();
                            done();
                        }, 1000);
                    });
                });

                itAsync('should remove listener after a specified timeout', function(done) {
                    return getFrame().then(function (frame) {
                        spy = spyOn(windowMock, 'removeEventListener');
                        msg = instance.sendTo(frame);
                        remove = msg.onResponse(function() {}, 150);
                        setTimeout(function() {
                            expect(spy).not.toHaveBeenCalled();
                        }, 145);
                        setTimeout(function() {
                            expect(spy).toHaveBeenCalled();
                            done();
                        }, 155);
                    });
                });

            });

        });

    });

});
