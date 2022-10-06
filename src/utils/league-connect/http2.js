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
exports.createHttp2Request = exports.Http2Response = exports.createHttpSession = void 0;
const http2_1 = __importDefault(require("http2"));
const http_1 = require("./http");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const assert_1 = __importDefault(require("assert"));
const RiotJs = require("../render/RIOT");
/**
 * Create a HTTP/2.0 client session.
 *
 * This invocation requires the credentials to have
 */
function createHttpSession(credentials) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const RIOT_GAMES_CERT = RiotJs.RIOT_GAMES_CERT
        const certificate = (_a = credentials.certificate) !== null && _a !== void 0 ? _a : RIOT_GAMES_CERT;
        return http2_1.default.connect(`https://127.0.0.1:${credentials.port}`, {
            ca: certificate,
            Connection:'keep-alive',
        });
    });
}
exports.createHttpSession = createHttpSession;
class Http2Response {
    constructor(headers, stream, raw) {
        this.headers = headers;
        this.raw = raw;
        (0, assert_1.default)(stream.closed, 'Response constructor called with unclosed ClientHttp2Stream');
        const code = headers[':status'];
        this.ok = code >= 200 && code < 300;
        this.redirected = code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
        this.status = code;
    }
    json() {
        return this.raw;
    }
}
exports.Http2Response = Http2Response;
function createHttp2Request(options, session, credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, assert_1.default)(!session.closed, 'createHttp2Request called on closed session');
        const request = session.request({
          ':path': '/' + (0, http_1.trim)(options.url),
          ':method': options.method,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'headers': {
            'Connection':'keep-alive',
          },
          Authorization: 'Basic ' + Buffer.from("riot:" + credentials.password).toString('base64')
        });
        request.setEncoding('utf8');
        if (options.body) {
            const data = JSON.stringify(options.body);
            const body = new util_1.TextEncoder().encode(data);
            request.write(body, 'utf8');
        }
        return new Promise((resolve, reject) => {
            let bodyText = '';
            let headers;
            request.on('response', (response) => {
                headers = response;
            });
            request.on('data', (data) => void (bodyText += data));
            request.on('error', (err) => reject(err));
            request.on('end', () => {
                try {
                    const json = JSON.parse(bodyText);
                    request.close();
                    resolve(new Http2Response(headers, request, json));
                }
                catch (jsonError) {
                    reject(jsonError);
                }
            });
        });
    });
}
exports.createHttp2Request = createHttp2Request;
