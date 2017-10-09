"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./../index");
const http = require("http");
const address = "http://127.0.0.1:4444";
const server = index_1.default(address);
jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
describe("Server", () => {
    beforeEach(() => {
        server.clear();
    });
    afterAll(() => {
        server.close();
    });
    it("simple", (done) => __awaiter(this, void 0, void 0, function* () {
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
    it("when url contains params", (done) => __awaiter(this, void 0, void 0, function* () {
        http.request({
            host: "127.0.0.1",
            port: 4444,
            path: "/test?x=1&b=2"
        }).end();
        yield server.waitForRequest();
        expect(server.when("GET", "/test").calls.count()).toBe(1);
        done();
    }));
    it("when send and receive headers", (done) => __awaiter(this, void 0, void 0, function* () {
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
    describe('#clear', () => {
        it('should remove old requests', (done) => __awaiter(this, void 0, void 0, function* () {
            http.request({
                host: "127.0.0.1",
                port: 4444,
                path: "/test"
            }).end();
            yield server.waitForRequest();
            expect(server.when("GET", "/test").calls.count()).toBe(1);
            server.clear();
            expect(server.when("GET", "/test").calls.count()).toBe(0);
            done();
        }));
        it('should filter by method', (done) => __awaiter(this, void 0, void 0, function* () {
            http.request({
                host: "127.0.0.1",
                port: 4444,
                path: "/test"
            }).end();
            http.request({
                method: 'POST',
                host: "127.0.0.1",
                port: 4444,
                path: "/test"
            }).end();
            yield server.waitForRequest();
            yield server.waitForRequest();
            server.clear('POST');
            expect(server.when("GET", "/test").calls.count()).toBe(1);
            expect(server.when("POST", "/test").calls.count()).toBe(0);
            done();
        }));
        it('should clear the path', (done) => __awaiter(this, void 0, void 0, function* () {
            http.request({
                host: "127.0.0.1",
                port: 4444,
                path: "/test1"
            }).end();
            http.request({
                host: "127.0.0.1",
                port: 4444,
                path: "/test2"
            }).end();
            yield server.waitForRequest();
            yield server.waitForRequest();
            server.clear(undefined, '/test1');
            expect(server.when("GET", "/test1").calls.count()).toBe(0);
            expect(server.when("GET", "/test2").calls.count()).toBe(1);
            done();
        }));
    });
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
