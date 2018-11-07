'use strict';


const chai = require('chai');
const expect = require('chai').expect;
const assert = require('chai').assert;
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = require("../app.js");
chai.use(require('chai-http'));

let site_us = {
            "site": {
                "id": "foo123",
                "page": "http://www.foo.com/why-foo"
              },
            "device": {
                "ip": "69.244.196.118"
              },
            "user": {
                "id": "9cb89r"
              }
            }

let site_us2 = {
            "site": {
                "id": "test123",
                "page": "http://www.foo.com/why-foo"
              },
            "device": {
                "ip": "69.244.196.120"
              },
            "user": {
                "id": "9cb89r"
              }
            }

let site_us3 = {
            "site": {
                "id": "testing3",
                "page": "http://www.foo.com/why-foo"
              },
            "device": {
                "ip": "69.244.196.130"
              },
            "user": {
                "id": "9cb89r"
              }
            }

let site_outside_us = {
            "site": {
                "id": "foo234",
                "page": "http://www.foo.com/why-foo"
              },
            "device": {
                "ip": "59.99.223.176"
              },
            "user": {
                "id": "9cb89r"
              }
            }


  it('should send 200 ok response', function() {
    return chai.request(app)
      .post('/')
      .send(site_us)
      .then(function(res) {
      try{
        expect(res).to.have.status(200);
        expect(res).to.be.json;
      }
      catch(err){
        expect(res.body).to.have.property("Message");
      }
      });
  });


  it('should contain the site property', function() {
    return chai.request(app)
      .post('/')
      .send(site_us)
      .then(function(res) {
      try{
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('site')
      }
      catch(err){
        expect(res.body).to.have.property("Message");
      }
      });
  });

  it('should contain the publishers property', function() {
    return chai.request(app)
      .post('/')
      .send(site_us2)
      .then(function(res) {
      try{
        expect(res).to.have.status(200);
        expect(res.body.site).to.have.property('publishers');
      }
      catch(err){
        expect(res.body).to.have.property("Message");
      }
      });
  });

  it('should contain the demographics property', function() {
    return chai.request(app)
      .post('/')
      .send(site_us3)
      .then(function(res) {
      try{
        expect(res).to.have.status(200);
        expect(res.body.site).to.have.property('demographics');
      }
      catch(err){
        expect(res.body).to.have.property("Message");
      }
      });
  });

  it('should contain the device property', function() {
    return chai.request(app)
      .post('/')
      .send(site_us)
      .then(function(res) {
      try{
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('device');
      }
      catch(err){
        expect(res.body).to.have.property("Message");
      }
      });
  });

  it('should contain the user property', function() {
    return chai.request(app)
      .post('/')
      .send(site_us3)
      .then(function(res) {
      try{
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('user');
      }
      catch(err){
        expect(res.body).to.have.property("Message");
      }
      });
  });

  it('publishers object should contain the id property', function() {
    return chai.request(app)
      .post('/')
      .send(site_us2)
      .then(function(res) {
      try{
        expect(res).to.have.status(200);
        expect(res.body.site.publishers).to.have.property('id');
      }
      catch(err){
        expect(res.body).to.have.property("Message");
      }
      });
  });

  it('publishers object should contain the name property', function() {
    return chai.request(app)
      .post('/')
      .send(site_us)
      .then(function(res) {
      try{
        expect(res).to.have.status(200);
        expect(res.body.site.publishers).to.have.property('name');
      }
      catch(err){
        expect(res.body).to.have.property("Message");
      }
      });
  });

  it('device object should contain the ip property', function() {
    return chai.request(app)
      .post('/')
      .send(site_us2)
      .then(function(res) {
      try{
        expect(res).to.have.status(200);
        expect(res.body.device).to.have.property('ip');
      }
      catch(err){
      expect(res.body).to.have.property("Message");
    }
      });
  });

  it('device object should contain the geo property', function() {
    return chai.request(app)
      .post('/')
      .send(site_us3)
      .then(function(res) {
      try{
        expect(res).to.have.status(200);
        expect(res.body.device).to.have.property('geo');
      }
      catch(err){
        expect(res.body).to.have.property("Message");
      }
      });
  });

  it('country of origin should be US', function() {
    return chai.request(app)
      .post('/')
      .send(site_us)
      .then(function(res) {
        try{
        expect(res).to.have.status(200);
        expect(res.body.device.geo).to.have.property('country', 'US')
      }
      catch(err){
        expect(res.body).to.have.property("Message");
      }
      });
  });

  // POST - Bad Request with incorrect country of origin
  it('should return Bad Request for country outside US', function() {
    return chai.request(app)
      .post('/')
      .send(site_outside_us)
      .then(function(res) {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('Message', 'country code is outside the US')
  });
});
