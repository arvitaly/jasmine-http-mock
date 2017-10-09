"use strict";
import * as express from "express"
import createHttpMock, { Server } from './../index'
import * as http from 'http'

const address = "http://127.0.0.1:4444"
const server = createHttpMock(address)
jasmine.DEFAULT_TIMEOUT_INTERVAL = 500

describe("Server", () => {
    beforeEach(() =>{
        server.clear()
    })
    afterAll(() => {
        server.close()
    })

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

    describe('#clear', () => {
        it('should remove old requests', async (done) => {
            http.request({
                host: "127.0.0.1",
                port: 4444,
                path: "/test"
            }).end()
            await server.waitForRequest()

            expect(server.when("GET", "/test").calls.count()).toBe(1)
            server.clear()
            expect(server.when("GET", "/test").calls.count()).toBe(0)
            done()
        });

        it('should filter by method', async (done) => {
            http.request({
                host: "127.0.0.1",
                port: 4444,
                path: "/test"
            }).end()
            http.request({
                method: 'POST',
                host: "127.0.0.1",
                port: 4444,
                path: "/test"
            }).end()
            await server.waitForRequest()
            await server.waitForRequest()

            server.clear('POST')
            expect(server.when("GET", "/test").calls.count()).toBe(1)
            expect(server.when("POST", "/test").calls.count()).toBe(0)
            done()
        });

        it('should clear the path', async (done) => {
            http.request({
                host: "127.0.0.1",
                port: 4444,
                path: "/test1"
            }).end()
            http.request({
                host: "127.0.0.1",
                port: 4444,
                path: "/test2"
            }).end()
            await server.waitForRequest()
            await server.waitForRequest()

            server.clear(undefined, '/test1')
            expect(server.when("GET", "/test1").calls.count()).toBe(0)
            expect(server.when("GET", "/test2").calls.count()).toBe(1)
            done()
        });
    });
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