import * as cheerio from 'cheerio';
import parser from "cron-parser"
import  Axios  from 'axios';
import fs from "fs";
import { save } from "./lib/db";

let script = `

    const { data } = await Axios.get("https://old.reddit.com/r/nfl");

    save(data);
`;

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

    let filename = "temp.js";

    try{

        fs.writeFileSync(filename, scriptWrapper);
    }
    catch(err){
        
        console.log(err)
    }
    
    let { runThis } = await import("../" + filename);

    runThis();

})();
