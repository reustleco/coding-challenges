process.env.NODE_ENV = 'test';

let app = require('../app');
import { use } from 'chai';
import { request } from 'chai';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');

use(chaiHttp);
let server = require('../server');
let authenticatedUser = request(server);
var db = require('../models/index');

// Initialize test db before tests
db.initDB();

describe('Auth', () => {
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
          res.should.have.status(200);
          res.body.should.be.a('Object');
          res.body.message.should.be.equal('User is already exist');
          done();
        });
    });
    it(`user already exist (username)`, (done) => {
      request(server)
        .post('/signup')
        .send({username: "user", email: "another@email.com", password: "123"})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('Object');
          res.body.message.should.be.equal('User is already exist');
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
          res.should.have.status(200);
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