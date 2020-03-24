const chai = require('chai');
const { assert, expect } = chai;
const nock = require('nock');
const index = require('../../index');
// const nock = require('nock');
chai.use(require('chai-http'));
const faker = require('faker');

const { Ticket, User } = require('../../database/models');
const mockUserData = require('../helpers/mock-users');
const authHelper = require('../helpers/user-authentication');

const mockTicket = {
    request: faker.random.words(10)
};
