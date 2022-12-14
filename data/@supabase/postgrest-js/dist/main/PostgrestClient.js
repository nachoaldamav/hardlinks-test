"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PostgrestQueryBuilder_1 = __importDefault(require("./lib/PostgrestQueryBuilder"));
const PostgrestRpcBuilder_1 = __importDefault(require("./lib/PostgrestRpcBuilder"));
const constants_1 = require("./lib/constants");
class PostgrestClient {
    /**
     * Creates a PostgREST client.
     *
     * @param url  URL of the PostgREST endpoint.
     * @param headers  Custom headers.
     * @param schema  Postgres schema to switch to.
     */
    constructor(url, { headers = {}, schema, fetch, throwOnError, } = {}) {
        this.url = url;
        this.headers = Object.assign(Object.assign({}, constants_1.DEFAULT_HEADERS), headers);
        this.schema = schema;
        this.fetch = fetch;
        this.shouldThrowOnError = throwOnError;
    }
    /**
     * Authenticates the request with JWT.
     *
     * @param token  The JWT token to use.
     */
    auth(token) {
        this.headers['Authorization'] = `Bearer ${token}`;
        return this;
    }
    /**
     * Perform a table operation.
     *
     * @param table  The table name to operate on.
     */
    from(table) {
        const url = `${this.url}/${table}`;
        return new PostgrestQueryBuilder_1.default(url, {
            headers: this.headers,
            schema: this.schema,
            fetch: this.fetch,
            shouldThrowOnError: this.shouldThrowOnError,
        });
    }
    /**
     * Perform a function call.
     *
     * @param fn  The function name to call.
     * @param params  The parameters to pass to the function call.
     * @param head  When set to true, no data will be returned.
     * @param count  Count algorithm to use to count rows in a table.
     */
    rpc(fn, params, { head = false, count = null, } = {}) {
        const url = `${this.url}/rpc/${fn}`;
        return new PostgrestRpcBuilder_1.default(url, {
            headers: this.headers,
            schema: this.schema,
            fetch: this.fetch,
            shouldThrowOnError: this.shouldThrowOnError,
        }).rpc(params, { head, count });
    }
}
exports.default = PostgrestClient;
//# sourceMappingURL=PostgrestClient.js.map