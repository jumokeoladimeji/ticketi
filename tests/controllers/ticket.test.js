const chai = require('chai');
const { expect } = chai;
const nock = require('nock');
const index = require('../../index');
const db = require('../../database/models/index')
// const nock = require('nock');
chai.use(require('chai-http'));
const faker = require('faker');

const { Ticket, User } = require('../../database/models');
const mockUserData = require('../helpers/mock-users');
const authHelper = require('../helpers/user-authentication');
const mockTickets = require('../helpers/mock-ticket-data');

const mockTicket = {
    request: faker.random.words(10)
};

let createdAdminData;
let createdCustomerData;
let createdAgentData;
let createdTicketData;
let ticketId;
let ticketArray = [];


describe('Ticket Controller', () => {
    before(() => {
       return  db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0")
       .then((result) => {
            return db.sequelize.sync({force: true});
        })
       .then(() => {
            return db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
        })
       .then(() => {
            return authHelper.getUserToken(mockUserData.adminUser)
        })
        .then((response) => {
            createdAdminData = response;
            return authHelper.getUserToken(mockUserData.testCustomer);
        })
        .then((response) => {
            createdCustomerData = response;
            return authHelper.getUserToken(mockUserData.testAgent);
        })
        .then((response) => {
            createdAgentData = response;
            mockTicket.userId = createdCustomerData.data.id;
            mockTicket.assignedToId = createdAgentData.data.id;
            return Ticket.create(mockTicket);
        })
        .then((ticket) => {
            createdTicketData = ticket.get();
            ticketArray.concat(createdTicketData);
            ticketId = createdTicketData.id;
            return Ticket.create(mockTickets[0]);
        })
        .then((ticket) => {
            const newTicket = ticket.get();
            newTicket.userId = createdCustomerData.data.id;
            ticketArray.concat(newTicket);
            return Ticket.create(mockTickets[1]);
        })
        .then((ticket) => {
            const newTicket = ticket.get();
            ticketArray.concat(newTicket);
            return Ticket.create(mockTickets[2]);
        })
        .then((ticket) => {
            const newTicket = ticket.get();
            ticketArray.concat(newTicket);
        });
    });
  
    
    describe('list Function', () => {
  
        it('should return an error message when the token is not provided', (done) => {
            nock('/api/v1')
            .get('/tickets')
            .reply(401);
            chai.request(index)
            .get('/api/v1/tickets')
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.message).to.eql('Token required for access');
                done();
            });
        });
    
        it('should return an error message when the token has expired or is invalid', (done) => {
            nock('/api/v1')
            .get('/tickets')
            .reply(401);
            chai.request(index)
            .get('/api/v1/tickets')
            .set('authorization', `${mockUserData.invalidToken}`)
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.message).to.eql('Session expired. Please login to continue');
                done();
            });
        });
        
        it('should return an error message when a customer wants to get all tickets', (done) => {
            nock('/api/v1')
                .get(`/tickets`)
                .reply(403);
                chai.request(index)
                .get('/api/v1/tickets')
                .set('authorization', `${createdCustomerData.token}`)
                .end((err, res) => {
                    expect(res).to.have.status(403);
                    expect(res.body.message).to.eql('Sorry, You are not authorized to perform this action');
                    done();
                });
        });

        it('should return all Tickets', (done) => {
            nock('/api/v1')
                .get('/tickets')
                .reply(200, ticketArray);
            chai.request(index)
                .get('/api/v1/tickets')
                .set('authorization', `${createdAdminData.token}`)
                // .send(ticketArray)
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('Create Function', () => {
        it('should return success a customer creates a ticket', (done) => {
            nock('/api/v1')
                .post(`/users/${createdCustomerData.data.id}/tickets`, mockTicket)
                .reply(200);
            chai.request(index)
                .post(`/api/v1/users/${createdCustomerData.data.id}/tickets`)
                .set('authorization', `${createdCustomerData.token}`)
                .send(mockTicket)
                .set('Accept', 'application/json')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.request).to.equal(mockTicket.request);
                    done();
                });
        });
    });


    describe('getOne Function', () => {
        it('should return an error if a user tries to fetch a non-existent ticket', (done) => {
            chai.request(index)
                .get(`/api/v1/users/${createdCustomerData.data.id}/tickets/0`)
                .set('authorization', `${createdCustomerData.token}`)
                .end((error, response) => {
                    expect(response).to.have.status(404);
                    expect(response.body).to.eql({ message: 'Ticket Not Found' });
                    done();
                });
        });

        it('should return one ticket', (done) => {
            nock('/api/v1')
                .get(`/users/${createdCustomerData.data.id}/tickets/${createdTicketData.id}`)
                .reply(200, createdTicketData);
            chai.request(index)
                .get(`/api/v1/users/${createdCustomerData.data.id}/tickets/${createdTicketData.id}`)
                .set('authorization', `${createdCustomerData.token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.request).to.eql(mockTicket.request);
                    done();
                });
        });
    });

    describe('listByUserId Function', () => {
        it('should return tickets that belong to that user', (done) => {
            nock('/api/v1')
                .get(`/users/${createdCustomerData.data.id}/tickets/${createdTicketData.id}`)
                .reply(200, createdTicketData);
            chai.request(index)
                .get(`/api/v1/users/${createdCustomerData.data.id}/tickets/${createdTicketData.id}`)
                .set('authorization', `${createdCustomerData.token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.userId).to.eql(createdCustomerData.data.id);
                    done();
                });
        });
    });

    describe('listAssignedToTickets Function', () => {
        it('should return tickets that belong to that user', (done) => {
            nock('/api/v1')
                .get(`/users/${createdCustomerData.data.id}/tickets/${createdTicketData.id}`)
                .reply(200, createdTicketData);
            chai.request(index)
                .get(`/api/v1/users/${createdCustomerData.data.id}/tickets/${createdTicketData.id}`)
                .set('authorization', `${createdCustomerData.token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.assignedToId).to.eql(createdAgentData.data.id);
                    done();
                });
        });
    });

    describe('markAsClosed Function', () => {
        it('should update one article', (done) => {
            nock('/api/v1')
                .put(`/users/${createdCustomerData.data.id}/tickets/assignedToTickets/${createdTicketData.id}`)
                .reply(200);
            chai.request(index)
                .put(`/api/v1/users/${createdCustomerData.data.id}/tickets/assignedToTickets/${createdTicketData.id}`)
                .set('authorization', `${createdAdminData.token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.status).to.eql('closed');
                    done();
                });
        });
    });

});