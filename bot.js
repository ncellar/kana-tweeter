"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fs = require("fs");
var Twit = require("twit/lib/twitter");
var kanas = fs.readFileSync('kana.txt', 'utf8').split('\n');
var variants = fs.readFileSync('variants.txt', 'utf8').split('\n');
var index = Math.floor(Math.random() * (kanas.length - 1));
var _a = kanas[index].split("\t"), hira = _a[0], kata = _a[1], roma = _a[2];
console.log([hira, kata, roma]);
var url = encodeURI("https://en.wikipedia.org/wiki/" + hira);
var status = hira + " / " + kata + " : " + url;
var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms: 1000 * 60,
});
function post_tweet_with_gif(roma) {
    return __awaiter(this, void 0, void 0, function () {
        var gif, response, media_id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gif = fs.readFileSync("gifs/" + roma + ".gif", { encoding: 'base64' });
                    return [4 /*yield*/, T.post('media/upload', { media_data: gif })];
                case 1:
                    response = _a.sent();
                    media_id = response.data.media_id_string;
                    if (response.data.errors != undefined)
                        return [2 /*return*/, Promise.reject(response.data.errors)];
                    return [2 /*return*/, T.post('statuses/update', { status: status, media_ids: [media_id] })];
            }
        });
    });
}
function post_tweet() {
    if ('GZJDBPV'.indexOf(roma[0]) < 0 && ['WI', 'WE'].indexOf(roma) < 0) {
        return post_tweet_with_gif(roma);
    }
    else {
        var match = variants
            .map(function (it) { return it.split('\t'); })
            .filter(function (it) { return it[0].indexOf(hira) >= 0; });
        if (match.length > 0)
            return post_tweet_with_gif(match[0][1]);
        else
            return T.post('statuses/update', { status: status });
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, post_tweet()];
                case 1:
                    response = _a.sent();
                    if (response.data.errors != undefined)
                        console.log(response.data.errors);
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (e) { return console.log(e); });
