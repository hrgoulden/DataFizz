let cheerio = require('cheerio');
var productsScraped = 0;

//empty constructor needed to reference from amazonCrawler.js
function productScraper(){}

productScraper.createObject = function($, productLink, callback){
	
	console.log("Scraping product: " + $('title').text() + "...");
	
	var listPriceText = $('.inlineBlock-display span.a-size-medium').text().trim();
	
	var nameText = $('#productTitle').text().trim();
	
	//removes html tags from description text
	var dimensionsText = $('.content b').filter(function() {
		return $(this).text().trim() === 'Product Dimensions:'
	}).parent().text().trim().slice(19).trim();
	var descriptionHTML = $('#outer_postBodyPS').prev().text();
	var description$ = cheerio.load(descriptionHTML);
	var descriptionText = description$('html > body').text().trim();
	
	//creates an array of imageURLs, avoids adding null values
	imageURLsArray = [];
	$('#imgThumbs').children().each(function(i, element){
		if($(this).children().attr('src') != null)
			imageURLsArray.push($(this).children().attr('src'));
	});

	//grabs shipping weight and removes unneeded text
	var weightText = $('.content b').filter(function() {
		return $(this).text().trim() === 'Shipping Weight:'
	}).parent().text().trim().slice(16).replace('(View shipping rates and policies)', '').trim();
	
	//create product object from gathered data
	var scrapedProduct = {
		"id": productsScraped,
		"name": nameText,
		"listPrice": listPriceText,
		"description": descriptionText,
		"product_dimension": dimensionsText,
		"imageURLs": imageURLsArray,
		"weight": weightText,
		"sourceURL": productLink
	}
	
	productsScraped++; 
	callback(scrapedProduct);
}

//exports for use by amazonCrawler.js
module.exports = productScraper;