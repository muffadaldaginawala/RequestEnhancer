var geo = require ('geoip2ws') ({
  userId: "137237",
  licenseKey: 'WYaoRKN04uXt',
  service: 'country',
});

module.exports = geo;