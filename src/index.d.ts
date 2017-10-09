/// <reference types="jasmine" />
/// <reference types="node" />
import * as http from 'http';
export declare class Server {
    all: jasmine.Spy;
    server: http.Server;
    constructor(address: any);
    private requests;
    private nextCall;
    waitForRequest(): Promise<{}>;
    when(method: any, path: any): jasmine.Spy;
    /**
     * Removes requests.
     * An optional filter can be supplied to specify the paths to remove
     * @param method method filter
     * @param path path filter
     */
    clear(method?: string, path?: string): void;
    /**
     * Filters the request based on method and/or path
     * @param method method filter
     * @param path path filter
     */
    private removeFilteredRequests(method, path);
    /**
     * Shuts down the server
     */
    close(): void;
}
export default function createServer(address: string): Server;
