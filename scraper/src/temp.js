

    const Axios = require('axios');

    const cheerio = require('cheerio');

    function runThis() {
        (async () => {

            const { data } = await Axios.get("https://www.chiefs.com/team/stats");

const $ = cheerio.load(data);

let topPlayers = $(".d3-o-table--leader-stats .d3-o-player-stats__player-name"); 

let saveData = [];

topPlayers.each( (idx, ele) => saveData.push( { name: $(ele).text().trim()}));

console.log(saveData) 

        })();

    }

    module.exports = {

        runThis
    }
    
