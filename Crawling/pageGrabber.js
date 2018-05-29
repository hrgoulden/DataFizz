let request = require('request');
let cheerio = require('cheerio');

//empty constructor needed to reference from amazonCrawler.js
function pageGrabber(){}

pageGrabber.accessPage = function(targetURL, callback){
	
	//loads html cheerio object after successful request
	request(targetURL, function(error, response, html){
		if(error != null){
			console.log("Connection failed! " + error);
		}
		else if(response.statusCode !== 200) {
			console.log("Connection failed! Status Code " + response.statusCode);
			return;
		}
		else{
			callback(cheerio.load(html));
		}
	});
}

//exports for use by amazonCrawler.js
module.exports = pageGrabber;