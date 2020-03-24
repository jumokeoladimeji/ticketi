
const chai = require('chai');
const { expect } = chai;
const bcrypt = require('bcryptjs');
chai.use(require('chai-http'));
const index = require('../../index');
const db = require('../../database/models/index')
const User = require('../../database/models').User;
const auth = require('../../middleware/authentication');
const faker = require('faker');


const userData = { fullName: faker.internet.userName(), 
    password: faker.internet.password(), 
    email: faker.internet.email()};

let adminToken;


describe('User Controller',  () => {
    after(() => {
        db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0")
        .then(function(result){
        return db.sequelize.sync({force: true});
        }).then(function(){
        return db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
        }).catch(function(err){

        });
    
    });

    describe('Sign Up Function', () => {

        it('should create users', (done) => {
            chai.request(index)
                .post('/api/v1/user/signup')
                .send(userData)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object');
                    done();
                });
        });

    });
    
    describe('Sign In Function', () => {
        it('should sign in users', (done) => {
            chai.request(index)
            .post('/api/v1/user/signin')
            .send({ password: userData.password,
                email: userData.email })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object')
                done();
            })
        });
    });
});