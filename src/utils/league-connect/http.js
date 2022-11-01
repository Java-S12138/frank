"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trim = exports.createHttp1Request = exports.Http1Response = void 0;
const https_1 = __importDefault(require("https"));
const util_1 = require("util");
const assert_1 = __importDefault(require("assert"));
/**
 * Mini-wrapper around http.IncomingMessage implementing common fields found in
 * fetch for easier transition from v5
 *
 * The previous implementation used fetch, so the fields ok, redirected, status
 * and statusText have been preserved.
 */
class Http1Response {
    constructor(message, raw) {
        this.message = message;
        this.raw = raw;
        (0, assert_1.default)(message.complete, 'Response constructor called with incomplete HttpIncomingMessage');
        // Safe assertion, this response originated from a http.ClientRequest
        const code = message.statusCode;
        // See https://fetch.spec.whatwg.org/#statuses
        this.ok = code >= 200 && code < 300;
        this.redirected = code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
        this.status = code;
        this.statusText = message.statusMessage;
    }
    /** Convenience method kept for easy migration from v5 */
    json() {
        return this.raw;
    }
}
exports.Http1Response = Http1Response;
function createHttp1Request(options, credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        const agentOptions = credentials.certificate === undefined ? { rejectUnauthorized: false } : { ca: credentials.certificate };
        return new Promise((resolve, reject) => {
            const request = https_1.default.request({
                host: '127.0.0.1',
                port: credentials.port,
                path: '/' + trim(options.url),
                method: options.method,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Connection':'keep-alive',
                    Authorization: 'Basic ' + Buffer.from(`riot:${credentials.password}`).toString('base64')
                },
                agent: new https_1.default.Agent(agentOptions)
            }, (response) => {
                let bodyText = '';
                response.setEncoding('utf8');
                response.on('data', (data) => void (bodyText += data));
                response.on('end', () => {
                  try {
                    if (bodyText.indexOf('{')!=-1){
                      const json = JSON.parse(bodyText);
                      resolve(new Http1Response(response, json));
                    }else {
                      resolve(new Http1Response(response, bodyText));
                    }
                  }
                  catch (jsonError) {
                    reject(jsonError);
                  }
                });
            });
            if (options.body !== undefined) {
                const data = JSON.stringify(options.body);
                const body = new util_1.TextEncoder().encode(data);
                request.write(body, 'utf8');
            }
            request.on('error', (err) => reject(err));
            request.end();
        });
    });
}
exports.createHttp1Request = createHttp1Request;
function trim(s) {
    let r = s;
    while (r.startsWith('/')) {
        r = r.substring(1);
    }
    return r;
}
exports.trim = trim;
