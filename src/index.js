"use strict";
var express = require("express");
var url = require('url');
class Server {
    constructor(address) {
        this.all = jasmine.createSpy("all");
        this.requests = {};
        var app = express();
        app.listen(url.parse(address).port, function () {
        });
        app.use((req, res, next) => {
            if (this.nextCall) {
                this.nextCall();
                this.nextCall = null;
            }
            this.all(req.url, req.body, req.headers);
            var mockRequest = this.when(req.method, url.parse(req.url).pathname);
            var r = mockRequest(req, res);
            if (r) {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.send(r);
            }
        });
    }
    waitForRequest() {
        return new Promise((resolve) => {
            this.nextCall = resolve;
        });
    }
    when(method, path) {
        if (!this.requests[method + ":" + path]) {
            this.requests[method + ":" + path] = jasmine.createSpy(method + ":" + path);
        }
        return this.requests[method + ":" + path];
    }
}
exports.Server = Server;
function createServer(address) {
    return new Server(address);
}
exports.default = createServer;
