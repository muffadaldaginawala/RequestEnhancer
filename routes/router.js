var request = require('request');
var redis = require('redis');
var REDIS_PORT = process.env.REDIS_PORT;
var client = redis.createClient(REDIS_PORT);
const geo = require ('geoip2ws') ({
  userId: "137237",
  licenseKey: 'WYaoRKN04uXt',
  service: 'country',
});


async function lookupGeoIP(ip){
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

async function getDemoGraphics(siteID){
	var url = "http://159.89.185.155:3000/api/sites/" + siteID + "/demographics";
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

async function getPublisher(siteID){
	var options = {
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
  				else if(res.body.error != undefined){
  					reject({"Message" : "Publisher Could Not be Found"})
  				}
  				else{
  					resolve(res.body);
  				}
		});
	});
}

async function createJson(siteID, ip, reqBody){
	try{
		var [dem, pub, geo] = await Promise.all([getDemoGraphics(siteID), getPublisher(siteID), lookupGeoIP(ip)])
	}
	catch(err){
		console.log(err)
		return(err);
	}

	pub_object = {
		"id" : pub.publisher.id,
		"name" : pub.publisher.name
	};

	geo_object = {
		"country": geo.iso_code 
	}

	//check if demographic API returns the correct object. If no then return percentage females as "not found"
	var dem_object = {};
	if(dem.demographics != undefined){
		dem_object = {
			"pct_female" : dem.demographics.pct_female
		}
	}
	else{
		dem_object = {
			"pct_female" : "NotFound"
		}
	}

	//finally inject in incoming request object
	reqBody.site["demographics"] = dem_object;
	reqBody.site["publishers"] = pub_object;
	reqBody.device["geo"] = geo_object;

	return(reqBody);
}

//handle incoming post request
var demoRouter = function(app){
	app.post("/", function(req,res){
		var siteID = req.body.site.id;
		var ip = req.body.device.ip;
		// client.get(siteID, function (err, data) {
        // if (err) throw err;

        // if (data != null) {
        	// console.log(JSON.parse(data));
            // res.send(JSON.parse(data));} 
            // else {
        createJson(siteID, ip, req.body).then(function(result){
		// client.set(siteID, JSON.stringify(result));
		if(result.Message != undefined){
			res.status(400).send(result);
		}
		else{
			res.send(result);
		}
	});
 // }
	});
}

module.exports = demoRouter;