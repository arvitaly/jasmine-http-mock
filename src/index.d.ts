declare module JasmineHttpMock {
    interface Server {
        all: jasmine.Spy
        waitForRequest(): Promise<void>
        when(method, path): jasmine.Spy
    }
    interface ServerStatic {
        new (address: string): Server
    }
}
declare module "jasmine-http-mock" {
    export default function createServer(address: string): JasmineHttpMock.Server
    export var Server: JasmineHttpMock.ServerStatic
}