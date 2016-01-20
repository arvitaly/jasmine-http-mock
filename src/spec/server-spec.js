"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
var index_1 = require('./../index');
var http = require('http');
var address = "http://127.0.0.1:4444";
var server = index_1.default(address);
jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
describe("Server", () => {
    it("simple", (done) => __awaiter(this, void 0, Promise, function* () {
        var answer = { c: "test" };
        server.when("GET", "/test").and.returnValue(answer);
        http.request({
            host: "127.0.0.1",
            port: 4444,
            path: "/test"
        }).end();
        yield server.waitForRequest();
        expect(server.when("GET", "/test").calls.count()).toBe(1);
        done();
    }));
    it("when url contains params", (done) => __awaiter(this, void 0, Promise, function* () {
        server.when("GET", "/test").calls.reset();
        http.request({
            host: "127.0.0.1",
            port: 4444,
            path: "/test?x=1&b=2"
        }).end();
        yield server.waitForRequest();
        expect(server.when("GET", "/test").calls.count()).toBe(1);
        done();
    }));
    it("when send and receive headers", (done) => __awaiter(this, void 0, Promise, function* () {
        server.when("GET", "/test").calls.reset();
        server.when("GET", "/test").and.callFake((req, res) => {
            expect(req.headers["test"]).toBe("X");
            res.setHeader("RTest", "X2");
            res.sendStatus(200);
        });
        var res = yield asyncRequest({
            host: "127.0.0.1",
            port: 4444,
            path: "/test",
            headers: {
                "Test": "X"
            }
        });
        expect(res.statusCode).toBe(200);
        expect(res.headers["rtest"]).toBe("X2");
        done();
    }));
});
function asyncRequest(options) {
    return new Promise((resolve, reject) => {
        var req = http.request(options, (res) => {
            resolve(res);
        });
        req.on("error", (err) => {
            reject(err);
        });
        req.end();
    });
}
