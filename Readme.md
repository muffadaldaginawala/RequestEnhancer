### Description and Objectives Completed

The Request Enhancer Augments an incoming Ad Request. It fetches data from various microservices and injects it into the Ad request

The project has been written in node.js and automated tests have been written using mocha chai.

Objectives Completed:

 - Inject the Site Demographics
 - Inject the Publisher details
 - Inject the Country of Origin
 - Latency is < 500ms
 - automated tests have been provied
 - abort transaction if request originates from ip address outside the US
 - abort the transaction if publisher ID cannot be obtained
 - application is fault-tolerant. incoming request proceeds despite failure of non-required service. 
 - If demographics cannot be obtained due to failure of microservice, we inject "Not Found" for "pct_female"
 - The application was also tested through Postman to run about 50 requests at a 50ms delay between each requests. Application was successfully able to handle all requests.

### Installing

cd into project directory 
"npm intsall" will install all your dependencies
npm start should start the server and get the project running 

### Testing 

All tests have been written using mocha chai
tests can be started through running the command "npm test" from root directory of project

### Sample test results : 

/**
Server is running on PORT: 3000
  ✓ should send 200 ok response (418ms)
  ✓ should contain the site property (330ms)
  ✓ should contain the publishers property (342ms)
  ✓ should contain the demographics property (346ms)
  ✓ should contain the device property (332ms)
  ✓ should contain the user property (347ms)
  ✓ publishers object should contain the id property (345ms)
  ✓ publishers object should contain the name property (350ms)
  ✓ device object should contain the ip property (355ms)
  ✓ device object should contain the geo property (330ms)
  ✓ country of origin should be US (343ms)
{ Message: 'country code is outside the US' }
  ✓ should return Bad Request for country outside US (78ms)

  12 passing (4s)

**/

/**
Server is running on PORT: 3000
  ✓ should send 200 ok response (383ms)
  ✓ should contain the site property (363ms)
  ✓ should contain the publishers property (328ms)
  ✓ should contain the demographics property (336ms)
  ✓ should contain the device property (318ms)
  ✓ should contain the user property (330ms)
  ✓ publishers object should contain the id property (327ms)
  ✓ publishers object should contain the name property (344ms)
  ✓ device object should contain the ip property (320ms)
  ✓ device object should contain the geo property (316ms)
  ✓ country of origin should be US (344ms)
{ Message: 'country code is outside the US' }
  ✓ should return Bad Request for country outside US (64ms)

    12 passing (4s)
 /**



