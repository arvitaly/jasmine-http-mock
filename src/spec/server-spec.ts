"use strict";
import * as express from "express"
import createhttpMock from './../index'
import * as http from 'http'
var address = "http://127.0.0.1:4444"
var server = createhttpMock(address)

jasmine.DEFAULT_TIMEOUT_INTERVAL = 500
describe("Server", () => {
    it("simple", async (done) => {
       
        var answer = { c: "test" }
        server.when("GET", "/test").and.returnValue(answer)
        http.request({
            host: "127.0.0.1",
            port: 4444,
            path: "/test"
        }).end()
        await server.waitForRequest()
        expect(server.when("GET", "/test").calls.count()).toBe(1)        
        
        done()
    })
    it("when url contains params", async (done) => {
        server.when("GET", "/test").calls.reset()
        http.request({
            host: "127.0.0.1",
            port: 4444,
            path: "/test?x=1&b=2"
        }).end()
        await server.waitForRequest()
        expect(server.when("GET", "/test").calls.count()).toBe(1)  
        done()
    })
    it("when send and receive headers", async (done) => {
        server.when("GET", "/test").calls.reset()
        server.when("GET", "/test").and.callFake((req: express.Request, res: express.Response) => {            
            expect(req.headers["test"]).toBe("X")
            res.setHeader("RTest", "X2")
            res.sendStatus(200)
        })
        var res = await asyncRequest({
            host: "127.0.0.1",
            port: 4444,
            path: "/test",
            headers: {
                "Test": "X"
            }
        })
        
        expect(res.statusCode).toBe(200)
        expect(res.headers["rtest"]).toBe("X2")
        done()
    })
})

function asyncRequest(options): Promise<http.IncomingMessage> {
    return new Promise((resolve, reject) => {
        var req = http.request(options, (res) => {
            resolve(res)
        })
        req.on("error", (err) => {
            reject(err)
        })
            req.end()
    })
}