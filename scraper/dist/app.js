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
const puppeteer_1 = __importDefault(require("puppeteer"));
//run
(() => __awaiter(void 0, void 0, void 0, function* () {
    let page = yield getSeriesPage();
    yield getAllChaptersForSeries(page);
}))();
function searchWithinThisContainerId() {
    return "readerarea";
}
function getPage() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        yield page.goto("https://");
        return page;
    });
}
function getSeriesPage() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        yield page.goto("https://cosmicscans.com/manga/6969-tower-of-god/");
        return page;
    });
}
function getChaptersSinceLastWatermark() {
    return __awaiter(this, void 0, void 0, function* () {
        let watermarkDate = new Date(1970, 1, 1);
        //let chapters : Chapter = [];
    });
}
function getAllChaptersForSeries(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const elements = yield page.$x('//div[@id="chapterlist"]//a/@href');
        console.log(elements);
    });
}
class Chapter {
}
