"use strict";
import * as express from "express"
import * as url from 'url'
export class Server {
    all = jasmine.createSpy("all")
    constructor(address) {
        var app = express()
        app.listen(url.parse(address).port, function () {
            
        });
        app.use((req, res, next) => {            
            if (this.nextCall) {
                this.nextCall()
                this.nextCall = null
            }
            this.all(req.url, req.body, req.headers)
            
            var mockRequest = this.when(req.method, url.parse(req.url).pathname)
            var r = mockRequest(req, res)
            if (r) {
                res.setHeader("Access-Control-Allow-Origin", "*")
                res.send(r)
            }
        })
    }
    private requests: { [index: string]: jasmine.Spy } = {}
    private nextCall
    waitForRequest() {
        return new Promise((resolve) => {
            this.nextCall = resolve
        })
    }
    when(method, path): jasmine.Spy {
        if (!this.requests[method + ":" + path]) {
            this.requests[method + ":" + path] = jasmine.createSpy(method + ":" + path)
        }
        return this.requests[method + ":" + path]
    }
}

export default function createServer(address: string) {
    return new Server(address)
}