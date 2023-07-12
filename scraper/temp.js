

    const Axios = require('axios');

    function runThis() {
        (async () => {

            
    const { data } = await Axios.get("https://old.reddit.com/r/nfl");

    console.log(data);

            
        })();

    }

    module.exports = {

        runThis
    }
    
