"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.DEPRECATED_request = exports.DEPRECATED_Response = void 0;
const node_fetch_1 = __importStar(require("node-fetch"));
const https_1 = __importDefault(require("https"));
const http_1 = require("./http");
/**
 * Wrapper around Node-fetch Response which will deserialize JSON into the
 * proper type
 */
class DEPRECATED_Response extends node_fetch_1.Response {
    constructor(parent) {
        super(parent.body, parent);
    }
    /**
     * Deserialize the response body into T
     */
    json() {
        const _super = Object.create(null, {
            json: { get: () => super.json }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const object = yield _super.json.call(this);
            return object;
        });
    }
}
exports.DEPRECATED_Response = DEPRECATED_Response;
function DEPRECATED_request(options, credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        const uri = (0, http_1.trim)(options.url);
        const url = `https://127.0.0.1:${credentials === null || credentials === void 0 ? void 0 : credentials.port}/${uri}`;
        const hasBody = options.method !== 'GET' && options.body !== undefined;
        const response = yield (0, node_fetch_1.default)(url, {
            method: options.method,
            body: hasBody ? JSON.stringify(options.body) : undefined,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Connection':'keep-alive',
                Authorization: 'Basic ' + Buffer.from(`riot:${credentials === null || credentials === void 0 ? void 0 : credentials.password}`).toString('base64')
            },
            agent: new https_1.default.Agent(typeof (credentials === null || credentials === void 0 ? void 0 : credentials.certificate) === 'undefined'
                ? {
                    rejectUnauthorized: false
                }
                : {
                    ca: credentials === null || credentials === void 0 ? void 0 : credentials.certificate
                })
        });
        return new DEPRECATED_Response(response);
    });
}
exports.DEPRECATED_request = DEPRECATED_request;
