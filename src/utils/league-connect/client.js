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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueClient = void 0;
const events_1 = require("events");
const authentication_1 = require("./authentication");
const DEFAULT_POLL_INTERVAL = 2500;
class LeagueClient extends events_1.EventEmitter {
    constructor(credentials, options) {
        super();
        this.options = options;
        this.isListening = false;
        this.credentials = undefined;
        this.credentials = credentials;
    }
    /**
     * Start listening for League Client processes
     */
    start() {
        // Only trigger if it's not already
        // running
        if (!this.isListening) {
            this.isListening = true;
            if (this.credentials === undefined || !processExists(this.credentials.pid)) {
                // Invalidated credentials or no LeagueClientUx process, fail
                throw new authentication_1.ClientNotFoundError();
            }
            this.onTick();
        }
    }
    /**
     * Stop listening for client stop/start
     */
    stop() {
        this.isListening = false;
    }
    onTick() {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isListening) {
                if (this.credentials !== undefined) {
                    // Current credentials are valid
                    if (!processExists(this.credentials.pid)) {
                        // No such process, emit disconnect and
                        // invalidate credentials
                        this.emit('disconnect');
                        this.credentials = undefined;
                        // Re-queue onTick to listen for credentials
                        this.onTick();
                    }
                    else {
                        // Process still lives, queue onTick
                        setTimeout(() => {
                            this.onTick();
                        }, (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.pollInterval) !== null && _b !== void 0 ? _b : DEFAULT_POLL_INTERVAL);
                    }
                }
                else {
                    // Current credentials were invalidated, wait for
                    // client to come back up
                    const credentials = yield (0, authentication_1.authenticate)({
                        awaitConnection: true,
                        pollInterval: (_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.pollInterval) !== null && _d !== void 0 ? _d : DEFAULT_POLL_INTERVAL
                    });
                    this.credentials = credentials;
                    this.emit('connect', credentials);
                    setTimeout(() => {
                        this.onTick();
                    }, (_f = (_e = this.options) === null || _e === void 0 ? void 0 : _e.pollInterval) !== null && _f !== void 0 ? _f : DEFAULT_POLL_INTERVAL);
                }
            }
        });
    }
}
exports.LeagueClient = LeagueClient;
function processExists(pid) {
    try {
        // `man 1 kill`: if sig is 0, then no signal is sent, but error checking
        // is still performed.
        return process.kill(pid, 0);
    }
    catch (err) {
        return (err === null || err === void 0 ? void 0 : err.code) === 'EPERM';
    }
}
