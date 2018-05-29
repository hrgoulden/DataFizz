let request = require('request');
let cheerio = require('cheerio');
let pageGrabber = require('./pageGrabber');
let productScraper = require('./productScraper');
let fs = require('fs'); 

var startingURL = "http://www.amazon.com";
var productType = "books";
var productCount = 10;
var productsScraped = 0;
var currentProductLink;
var productLinkList = [];
var productsGathered = {};
var productObjects = [];

startCrawl();

//initial function, states crawl details and grabs category page
function startCrawl(){
	
	console.log("Beginning crawl. Starting URL: " + startingURL + " product type: " + productType + "\n");
	pageGrabber.accessPage((startingURL + "/" + productType), gatherProductLinks);
}

//gathers all available product linkes on category page
function gatherProductLinks($){
	
	var productLinks = $("a[href^='/gp/product/B']");
	productLinks.each(function() {
		productLinkList.push($(this).attr('href'));
	});
	productLinks = $("a[href^='/gp/product/0']");
	productLinks.each(function() {
		productLinkList.push($(this).attr('href'));
	});
	productLinks = $("a[href^='/gp/product/1']");
	productLinks.each(function() {
		productLinkList.push($(this).attr('href'));
	});
	if(productLinkList.length == 0) 
		console.log("Error: No products found.");
	else 
		scrapeProducts();
}

//uses productScraper.js to get data from gathered projects
function scrapeProducts(){
	
	//if enough products have been gathered, produces final .json file
	if (productsScraped == productCount){
		fs.writeFile('products.json', JSON.stringify(productObjects, "product", 4), (err)=>{console.log("\nCrawl complete! Product data saved in products.json")});
	}
	
	else{
		currentProductLink = productLinkList.pop();
		if (currentProductLink in productsGathered){
			scrapeProducts();
		}
		else{
			productsScraped++;
			productsGathered[currentProductLink] = true;
			pageGrabber.accessPage((startingURL + currentProductLink), createProductObject);
		}
	}
}

//uses productScraper to create an object while scraping product page
function createProductObject($){
	productScraper.createObject($, currentProductLink, addProductToList);
}

//gathers completed product then returns to scraping new ones
function addProductToList(productObject){
	productObjects.push(productObject);
	scrapeProducts();
}