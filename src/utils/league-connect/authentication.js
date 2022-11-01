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
exports.authenticate = exports.ClientNotFoundError = exports.InvalidPlatformError = void 0;
const fs_1 = __importDefault(require("fs"));
const child_process_1 = __importDefault(require("child_process"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const exec = util_1.default.promisify(child_process_1.default.exec);
const DEFAULT_NAME = 'LeagueClientUx';
const DEFAULT_POLL_INTERVAL = 2500;
const RiotJs = require("../render/RIOT");
/**
 * Indicates that the application does not run on an environment that the
 * League Client supports. The Client runs on windows, linux or darwin.
 */
class InvalidPlatformError extends Error {
    constructor() {
        super('process runs on platform client does not support');
    }
}
exports.InvalidPlatformError = InvalidPlatformError;
/**
 * Indicates that the league client could not be found
 */
class ClientNotFoundError extends Error {
    constructor() {
        super('league client process could not be located');
    }
}
exports.ClientNotFoundError = ClientNotFoundError;
/**
 * Locates a League Client and retrieves the credentials for the LCU API
 * from the found process
 *
 * If options.awaitConnection is false the promise will resolve into a
 * rejection if a League Client is not running
 *
 * @param options {AuthenticationOptions} Authentication options, if any
 *
 * @throws InvalidPlatformError If the environment is not running
 * windows/linux/darwin
 */
function authenticate(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const RIOT_GAMES_CERT = RiotJs.RIOT_GAMES_CERT
        function tryAuthenticate() {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                const name = (_a = options === null || options === void 0 ? void 0 : options.name) !== null && _a !== void 0 ? _a : DEFAULT_NAME;
                const portRegex = /--app-port=([0-9]+)/;
                const passwordRegex = /--remoting-auth-token=([\w-_]+)/;
                const pidRegex = /--app-pid=([0-9]+)/;
                const isWindows = process.platform === 'win32';
                let command;
                if (!isWindows) {
                    command = `ps x -o args | grep '${name}'`;
                }
                else if (isWindows && (options === null || options === void 0 ? void 0 : options.useDeprecatedWmic) === true) {
                    command = `wmic process where caption='${name}.exe' get commandline`;
                }
                else {
                    command = `Get-CimInstance -Query "SELECT * from Win32_Process WHERE name LIKE '${name}.exe'" | Select-Object CommandLine | fl`;
                }
                const executionOptions = isWindows ? { shell: (_b = options === null || options === void 0 ? void 0 : options.windowsShell) !== null && _b !== void 0 ? _b : 'powershell' } : {};
                try {
                    // See #59 and #60 for why we are replacing all whitespace in the raw output
                    const { stdout: rawStdout } = yield exec(command, executionOptions);
                    // TODO: investigate regression with calling .replace on rawStdout
                    const stdout = rawStdout.replace(/\s/g, '');
                    const [, port] = stdout.match(portRegex);
                    const [, password] = stdout.match(passwordRegex);
                    const [, pid] = stdout.match(pidRegex);
                    const unsafe = (options === null || options === void 0 ? void 0 : options.unsafe) === true;
                    const hasCert = (options === null || options === void 0 ? void 0 : options.certificate) !== undefined;
                    // See flow chart for this here: https://github.com/matsjla/league-connect/pull/44#issuecomment-790384881
                    // If user specifies certificate, use it
                    const certificate = hasCert
                        ? options.certificate
                        : // Otherwise: does the user want unsafe requests?
                            unsafe
                                ? undefined
                                : // Didn't specify, use our own certificate
                                    RIOT_GAMES_CERT;
                    return {
                        port: Number(port),
                        pid: Number(pid),
                        password,
                        certificate
                    };
                }
                catch (_c) {
                    throw new ClientNotFoundError();
                }
            });
        }
        // Does not run windows/linux/darwin
        if (!['win32', 'linux', 'darwin'].includes(process.platform)) {
            throw new InvalidPlatformError();
        }
        if (options === null || options === void 0 ? void 0 : options.awaitConnection) {
            // Poll until a client is found, attempting to resolve every
            // `options.pollInterval` milliseconds
            return new Promise(function self(resolve, reject) {
                tryAuthenticate()
                    .then((result) => {
                    resolve(result);
                })
                    .catch((_) => {
                    var _a;
                    setTimeout(self, (_a = options === null || options === void 0 ? void 0 : options.pollInterval) !== null && _a !== void 0 ? _a : DEFAULT_POLL_INTERVAL, resolve, reject);
                });
            });
        }
        else {
            return tryAuthenticate();
        }
    });
}
exports.authenticate = authenticate;
