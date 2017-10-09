import * as express from "express"
import * as url from 'url'
import * as http from 'http'
export class Server {
    all = jasmine.createSpy("all")
    server: http.Server
    constructor(address) {
        const app = express()
        this.server = app.listen(url.parse(address).port);

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

    /**
     * Removes requests.
     * An optional filter can be supplied to specify the paths to remove
     * @param method method filter
     * @param path path filter
     */
    clear(method?: string, path?: string) {
        if (method || path) {
            return this.removeFilteredRequests(method, path)
        }
        this.requests = {}
    }

    /**
     * Filters the request based on method and/or path
     * @param method method filter
     * @param path path filter
     */
    private removeFilteredRequests(method: string, path: string) {
        const keys = Object.keys(this.requests)
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i].split(':', 2)
            if ((method && key[0] !== method) ||
                (path && key[1] !== path)) {
                continue;
            }

            this.requests[keys[i]] = undefined;
        }
    }

    /**
     * Shuts down the server
     */
    close() {
        this.server.close()
    }
}

export default function createServer(address: string) {
    return new Server(address)
}