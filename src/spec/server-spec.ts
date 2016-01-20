"use strict";
import createhttpMock from './../index'
import * as http from 'http'
var address = "http://127.0.0.1:4444"
var server = createhttpMock(address)

jasmine.DEFAULT_TIMEOUT_INTERVAL = 500
describe("test1", () => {
    it("etest1", async (done) => {
       
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
})