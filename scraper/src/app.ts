import * as cheerio from 'cheerio';
import parser from "cron-parser"
import  Axios  from 'axios';
import fs from "fs";

//run
(async () => {

    const { data } = await Axios.get("https://old.reddit.com/r/nfl");

    const $ = cheerio.load(data);

    page($)
        .elements('post')
        .where('title', 'contains', 'peyton')
        .and('upvotes','>', '100')
        .build();

})();


function page($: cheerio.CheerioAPI) : PageWithElements {

    return new PageWithElements($);

}

let siteGraph : any = {};

siteGraph["post"] = "div[data-context='listing']";

siteGraph["title"] = "a[data-event-action='title']";

class WhereFilter {

    whereFilter: string = "";

    whereComporor: string = "";

    whereSelector: string = "";
}

class PageWithElements {

    pageUrl: string = "";

    selectedElement: string = "";

    whereFilters : WhereFilter[] = [];

    $?: cheerio.CheerioAPI;

    /**
     *
     */
    constructor($: cheerio.CheerioAPI) {
        this.$ = $;
    }

    elements = (name: string) => {

        this.selectedElement = name;

        return this;
    }


    where = (selector: string, comparor: string, filter: string) => {

        let whereFilter : WhereFilter = {
            whereSelector: selector,
            whereComporor: comparor,
            whereFilter: filter,
        }

        this.whereFilters.push(whereFilter);

        return this;
    }

    and = (selector: string, comparor: string, filter: string) => this.where(selector, comparor, filter);

    build = () => {

        if(this.$) {

            let filteredElms : any[] = [];

            this.$(siteGraph[this.selectedElement]).each( (idx, elm) => {
                
                let filtered = this.filter(elm, this.whereFilters[0]);

                if(filtered.length > 0) {

                    filteredElms = filteredElms.concat(filtered);
                }

                
            });

            filteredElms.forEach( elm => {
                
                this.whereFilters.slice(1).forEach(and => {

                    let filtered = this.filter(elm, and);
    
                    if(filtered.length > 0) {
    
                        filteredElms = filteredElms.concat(filtered);
                    }
                });
            });

        }

    }

    filter = (elm: any, whereFiler : WhereFilter) : any[] => {
        
        let filteredElms : any [] = [];

        this.$!(elm).find(siteGraph[whereFiler.whereSelector]).each( (idx2, elm2) => {

            if(whereFiler.whereComporor == "contains"){
                if(this.$!(elm2).text().toLowerCase().includes(whereFiler.whereFilter.toLowerCase())){

                    filteredElms.push(elm);
                }
            }

            if(whereFiler.whereComporor == ">"){

                if(+this.$!(elm2).text() >  +whereFiler.whereFilter){

                    filteredElms.push(elm);
                }
            }
        });

        return filteredElms;
    }

}

function convertDateToUTC(date : any) { return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); }


async function downloadImage(url : string) : Promise<any>{

    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer'
    });

    return Buffer.from(response.data, "utf-8");
}

async function getAllSyncsToRun() : Promise<Sync[]>{

    let response = await fetch("http://127.0.0.1:3000/sync", {
        headers:{
            "x-api-key": "db042791-a13e-48af-893f-c96d76e4fc92"
        }
    });

    let syncs = await response.json();

    let syncsToRun : Sync[] = [];


    syncs.forEach((element : any) => {

        var interval = parser.parseExpression(element.frequency ?? "");

        if(element.lastSyncDateTime){

            if(new Date(interval.prev().toDate().toISOString()) > new Date(element.lastSyncDateTime)){

                syncsToRun.push({
                    seriesName: element.expand.series.title,
                    siteAllSeriesUrl: element.siteAllSeriesUrl,
                    watermark: element.watermark,
                    site: element.site,
                    seriesPageUrl: element.seriesPageUrl

                } as Sync);
            }

        }else{

            syncsToRun.push({
                seriesName: element.expand.series.title,
                siteAllSeriesUrl: element.siteAllSeriesUrl,
                watermark: element.watermark,
                site: element.site,
                seriesPageUrl: element.seriesPageUrl

            } as Sync);
        }
    });

    return syncsToRun;

}

async function downloadChapter(){

}
function getChaptersSinceLastWatermark(chapters: Chapter[], watermark: string) : Chapter[]{

    let filtered = chapters.filter(n => (n.number ?? 1 )> Number(watermark));

    return filtered;

}

function parseElementForChapter(element: any) : Chapter {
    
    let chapter : Chapter = {};

    let href = element.href;

    let text = element.text;

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const monthPattern = monthNames.map(name => `(?:${name}(?:\\s+\\w+)?|${name.slice(0, 3)}(?:\\s+\\w+)?)`).join("|");
    const datePattern = new RegExp(`\\b(${monthPattern})\\s+\\d{1,2},\\s+\\d{4}\\b`, "i");
    
    const dateMatches = text.match(datePattern);

    const date = dateMatches[0];

    chapter.date = new Date(date);

    const pattern = /\bChapter\s+(\d+)\b/i;

    const chapterMatches = text.match(pattern);

    const chapterText = chapterMatches[1];

    chapter.number = chapterText.split(' ')[0];

    chapter.title = chapterText;

    chapter.url = href;

    return chapter;

}

class Chapter {

    series?: string;

    url?: string;

    date?: Date;

    number?: number;

    title?: string;

}

class ChapterPage {

    imageUrl? : string;

    number?: number;

}

class Sync {

    name?: string;

    site?: string;

    siteAllSeriesUrl?: string;

    lastSyncDateTime?: Date;

    frequency?: string;

    watermark?: string;

    seriesPageUrl?: string;

}