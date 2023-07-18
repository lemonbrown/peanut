#!/usr/bin/env node
import * as cheerio from 'cheerio';
import * as parser from "cron-parser"
import  Axios  from 'axios';
import * as fs from "fs";
import { save } from "./lib/db";
import { tmpdir } from 'os';
import * as process from "process"

var args = process.argv.length > 2 ? process.argv.splice(0) : ["../test/topPlayersScrape.js"];

let fileToRunName = args[0];

let basePath = process.cwd()

let script = fs.readFileSync(fileToRunName).toString();

let scriptWrapper = `

    const Axios = require('axios');

    const cheerio = require('cheerio');

    function runThis() {
        (async () => {

            ${script}

        })();

    }

    module.exports = {

        runThis
    }
    
`;

//run
(async () => {

    let tempFileName = "temp.js"; 

    try{

        fs.writeFileSync(tempFileName, scriptWrapper);
    }
    catch(err){
        
        console.log(err)
    }

    console.log(basePath)
    
    let { runThis } = await import( basePath + "\/" + tempFileName);

    runThis();

})();
