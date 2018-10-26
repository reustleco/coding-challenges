process.env.NODE_ENV = 'test';

import { use } from 'chai';
import { request } from 'chai';

//Require the dev-dependencies
const chaiHttp = require('chai-http');
const chai = require('chai');
const should = chai.should();

use(chaiHttp);
const server = require('../server');
const authenticatedUser = request.agent(server);
const db = require('../models/index');


describe('Auth', () => {
  // Initialize test db before tests
  before((done) => {
    db.initDB(done);
  });
  describe('Sign up', () => {
    it(`should create user`, (done) => {
      request(server)
        .post('/signup')
        .send({username: "user", email: "user@email.com", password: "123"})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('Object');
          res.body.message.should.be.equal('User successfully created');
          res.body.username.should.be.equal('user');
          res.body.email.should.be.equal('user@email.com');
          done();
        });
    });
    it(`user already exists (email)`, (done) => {
      request(server)
        .post('/signup')
        .send({username: "username", email: "user@email.com", password: "123"})
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a('Object');
          res.body.message.should.be.equal('User already exists');
          done();
        });
    });
    it(`user already exists (username)`, (done) => {
      request(server)
        .post('/signup')
        .send({username: "user", email: "another@email.com", password: "123"})
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a('Object');
          res.body.message.should.be.equal('User already exists');
          done();
        });
    });
  });


  describe('Login', () => {
    it(`should return user data`, (done) => {
      request(server)
        .post('/login')
        .send({username: "user", password: "123"})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('Object');
          res.body.username.should.be.equal('user');
          res.body.email.should.be.equal('user@email.com');
          done();
        });
    });
    it(`should return error`, (done) => {
      request(server)
        .post('/login')
        .send({username: "user", password: "1234"})
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('Object');
          res.body.message.should.be.equal('Wrong credentials!');
          done();
        });
    });
  });

  describe('Only auth users have access', () => {
    before((done) => {
      authenticatedUser
        .post(`/login`)
        .send({username: "user", password: "123"})
        .end(function(err, res){
          res.should.have.status(200);
          done();
        });
    });
    it(`should return 200`, (done) => {
      authenticatedUser
        .get('/profile')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it(`should return 302`, (done) => {
      request(server)
        .get('/profile')
        .end((err, res) => {
          res.should.have.status(302);
          done();
        });
    });
  });
});