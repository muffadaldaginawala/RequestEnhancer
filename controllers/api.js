const request = require('request');
const geo = require("../geo_config");

function lookupGeoIP(ip){
	/**
     * Looks up the Geo IP by using the geoipws package
     * @function  lookupGeoIP
     * @param  {string} id
     * @return {promise}
     */
	return new Promise(function(resolve,reject){
	geo(ip, function(err, res){
		if(err){
			reject(err);
		}
		//if message originates from an IP outside the US, abort the transaction
	 	else if(res.country.iso_code != "US"){
	 			reject({"Message":"country code is outside the US"});
	 		}
		else{
			resolve(res.country);
			}
		});
	});
}

function getDemoGraphics(siteID){
	/**
     * Hits the demographic API by using siteID
     * @function  getDemographics
     * @param  {string} siteID
     * @return {promise}
     */
	const url = "http://159.89.185.155:3000/api/sites/" + siteID + "/demographics";
	 return new Promise(function(resolve, reject) {
	 	request.get(url, function(err,res){
	 		if(err){
	 			reject(err);
	 		}
	 		else{
	 			resolve(JSON.parse(res.body));
	 			}
	 		})
	 	});
  	}

function getPublisher(siteID){
	/**
     * Hits the publisher IP by using siteID
     * @function  getPublisher
     * @param  {string} siteID
     * @return {promise}
     */
	const options = {
	  uri: 'http://159.89.185.155:3000/api/publishers/find',
	  method: 'POST',
	  json: {
  		"q": {
    		"siteID": siteID
  			}
		}

	}

	return new Promise(function(resolve, reject) {
		request(options, function (err,res) {
				if(err){
					reject(err);
  					}
  				//If publisher API returns an error message then abort the transaction
  				else if(res.body.error){
  					reject({"Message" : "Publisher Could Not be Found"})
  				}
  				else{
  					resolve(res.body);
  				}
			});
		});
	}

async function createJson(siteID, ip, reqBody){
	/**
     * async function Constructs the final response to be sent by resolving all promises
     * @function  createJson
     * @param  {string} id, {string} ip, {object} reqBody
     * @return {promise}
     */
	try{
		var [dem, pub, geo] = await Promise.all([getDemoGraphics(siteID), getPublisher(siteID), lookupGeoIP(ip)])
	}
	catch(err){
		console.log(err)
		return(err);
	}

	let resultSite = {
      publishers :  {
          "id" : pub.publisher.id,
          "name" : pub.publisher.name
      }, 
     demographics: {
           pct_female :  dem.demographics ? dem.demographics.pct_female : "Not Found"
      	},
	};

	let geoResult = {
		"country": geo.iso_code 
	}

	reqBody.site["demographics"] = resultSite.demographics;
	reqBody.site["publishers"] = resultSite.publishers;
	reqBody.device["geo"] = geoResult;

	return(reqBody);
}


exports.requestEnhancer = function(req,res){
		const siteID = req.body.site.id;
		const ip = req.body.device.ip;
        createJson(siteID, ip, req.body).then(function(result){
		if(result.Message){
			res.status(400).send(result);
		}
		else{
			res.send(result);
		}
	});
}

