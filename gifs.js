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
var request = require("request-promise-native");
var promisify = require("es6-promisify");
var gm = require("gm");
var _download = require("download-file");
function promisify_unbound(f) {
    var flat = promisify(function (self) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return f.apply(self, args);
    });
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return flat.apply(void 0, [this].concat(args));
    };
}
gm.prototype.write_promise = promisify_unbound(gm.prototype.write);
var download = promisify(_download);
var unlink = promisify(fs.unlink);
// ----------------------------------------------------------------------------
var kanas = fs.readFileSync('kana.txt', 'utf8')
    .split('\n')
    .map(function (line) { return line.split('\t'); });
function fetch_gif_throws(roma, kana, type) {
    return __awaiter(this, void 0, void 0, function () {
        var page_url, gif_url_regex, page_data, gif_url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    page_url = encodeURI("https://commons.wikimedia.org/wiki/File:" + type + "_" + kana + "_stroke_order_animation.gif");
                    gif_url_regex = RegExp("https://upload.wikimedia.org/wikipedia/commons/.*?/" + type + "_.*?_stroke_order_animation.gif");
                    return [4 /*yield*/, request(page_url)];
                case 1:
                    page_data = _a.sent();
                    gif_url = gif_url_regex.exec(page_data)[0];
                    return [2 /*return*/, download(gif_url, { filename: "gifs/" + roma + "_" + type + ".gif" })];
            }
        });
    });
}
function fetch_gif(roma, kana, type) {
    return fetch_gif_throws(roma, kana, type)
        .catch(function (e) { return Promise.reject("could not download " + roma + "_" + type + ".gif"); });
}
function make_kana_gif(hira, kata, roma) {
    return __awaiter(this, void 0, void 0, function () {
        var hira_gif, kana_gif;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hira_gif = fetch_gif(roma, hira, 'Hiragana');
                    kana_gif = fetch_gif(roma, kata, 'Katakana');
                    return [4 /*yield*/, Promise.all([hira_gif, kana_gif])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, gm().in("gifs/" + roma + "_Hiragana.gif")
                            .in("gifs/" + roma + "_Katakana.gif")
                            .write_promise("gifs/" + roma + ".gif")];
                case 2:
                    _a.sent();
                    return [2 /*return*/, Promise.all([
                            unlink("gifs/" + roma + "_Hiragana.gif"),
                            unlink("gifs/" + roma + "_Katakana.gif")
                        ])];
            }
        });
    });
}
// for testing
// let kanas2 = [['あ', 'ア', 'A']]
if (!fs.existsSync('gifs'))
    fs.mkdirSync('gifs');
for (var _i = 0, kanas_1 = kanas; _i < kanas_1.length; _i++) {
    var _a = kanas_1[_i], hira = _a[0], kata = _a[1], roma = _a[2];
    if ('GZJDBPV'.indexOf(roma[0]) < 0 && ['WI', 'WE'].indexOf(roma) < 0) {
        make_kana_gif(hira, kata, roma)
            .catch(function (e) { return console.log(e); });
    }
}
