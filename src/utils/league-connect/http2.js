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
/**
 * Create a HTTP/2.0 client session.
 *
 * This invocation requires the credentials to have
 */
function createHttpSession(credentials) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const RIOT_GAMES_CERT = "-----BEGIN CERTIFICATE-----\n" +
          "MIIEIDCCAwgCCQDJC+QAdVx4UDANBgkqhkiG9w0BAQUFADCB0TELMAkGA1UEBhMC\n" +
          "VVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFTATBgNVBAcTDFNhbnRhIE1vbmljYTET\n" +
          "MBEGA1UEChMKUmlvdCBHYW1lczEdMBsGA1UECxMUTG9MIEdhbWUgRW5naW5lZXJp\n" +
          "bmcxMzAxBgNVBAMTKkxvTCBHYW1lIEVuZ2luZWVyaW5nIENlcnRpZmljYXRlIEF1\n" +
          "dGhvcml0eTEtMCsGCSqGSIb3DQEJARYeZ2FtZXRlY2hub2xvZ2llc0ByaW90Z2Ft\n" +
          "ZXMuY29tMB4XDTEzMTIwNDAwNDgzOVoXDTQzMTEyNzAwNDgzOVowgdExCzAJBgNV\n" +
          "BAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRUwEwYDVQQHEwxTYW50YSBNb25p\n" +
          "Y2ExEzARBgNVBAoTClJpb3QgR2FtZXMxHTAbBgNVBAsTFExvTCBHYW1lIEVuZ2lu\n" +
          "ZWVyaW5nMTMwMQYDVQQDEypMb0wgR2FtZSBFbmdpbmVlcmluZyBDZXJ0aWZpY2F0\n" +
          "ZSBBdXRob3JpdHkxLTArBgkqhkiG9w0BCQEWHmdhbWV0ZWNobm9sb2dpZXNAcmlv\n" +
          "dGdhbWVzLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKoJemF/\n" +
          "6PNG3GRJGbjzImTdOo1OJRDI7noRwJgDqkaJFkwv0X8aPUGbZSUzUO23cQcCgpYj\n" +
          "21ygzKu5dtCN2EcQVVpNtyPuM2V4eEGr1woodzALtufL3Nlyh6g5jKKuDIfeUBHv\n" +
          "JNyQf2h3Uha16lnrXmz9o9wsX/jf+jUAljBJqsMeACOpXfuZy+YKUCxSPOZaYTLC\n" +
          "y+0GQfiT431pJHBQlrXAUwzOmaJPQ7M6mLfsnpHibSkxUfMfHROaYCZ/sbWKl3lr\n" +
          "ZA9DbwaKKfS1Iw0ucAeDudyuqb4JntGU/W0aboKA0c3YB02mxAM4oDnqseuKV/CX\n" +
          "8SQAiaXnYotuNXMCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAf3KPmddqEqqC8iLs\n" +
          "lcd0euC4F5+USp9YsrZ3WuOzHqVxTtX3hR1scdlDXNvrsebQZUqwGdZGMS16ln3k\n" +
          "WObw7BbhU89tDNCN7Lt/IjT4MGRYRE+TmRc5EeIXxHkQ78bQqbmAI3GsW+7kJsoO\n" +
          "q3DdeE+M+BUJrhWorsAQCgUyZO166SAtKXKLIcxa+ddC49NvMQPJyzm3V+2b1roP\n" +
          "SvD2WV8gRYUnGmy/N0+u6ANq5EsbhZ548zZc+BI4upsWChTLyxt2RxR7+uGlS1+5\n" +
          "EcGfKZ+g024k/J32XP4hdho7WYAS2xMiV83CfLR/MNi8oSMaVQTdKD8cpgiWJk3L\n" +
          "XWehWA==\n" +
          "-----END CERTIFICATE-----"
        const certificate = (_a = credentials.certificate) !== null && _a !== void 0 ? _a : RIOT_GAMES_CERT;
        return http2_1.default.connect(`https://127.0.0.1:${credentials.port}`, {
            ca: certificate
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
            Authorization: 'Basic ' + Buffer.from(`riot:${credentials.password}`).toString('base64')
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
