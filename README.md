# jasmine-http-mock
Mock http-server for use in E2E jasmine tests

[![Build Status](https://travis-ci.org/arvitaly/jasmine-http-mock.svg?branch=master)](https://travis-ci.org/arvitaly/jasmine-http-mock)
[![npm version](https://badge.fury.io/js/jasmine-http-mock.svg)](https://badge.fury.io/js/jasmine-http-mock)

# Install
    
    npm install jasmine-http-mock --save-dev
    
# Usage
    
    import createMockServer from "jasmine-http-mock"
    
    import * as http from 'http'
    var address = "http://127.0.0.1:4444"
    //Get only port from address
    var server = createMockServer(address)
    
    describe("test1", () => {    
    //Async test
        it("etest1", async (done) => {
            var answer = { c: "test" }
            server.when("GET", "/test").and.returnValue(answer)
            //Really we can do any actions, example, selenium browser.get(address)
            http.request({
                host: "127.0.0.1",
                port: 4444,
                path: "/test"
            }).end()
            //Wait for next request
            await server.waitForRequest()
            expect(server.when("GET", "/test").calls.count()).toBe(1)        
            done()
        })
    })
    
# Test
    npm install jasmine -g
    cd ./src
    npm test
    