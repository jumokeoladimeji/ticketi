/* eslint-disable no-undef */
const chai = require('chai');
const { expect, assert } = chai;
const bcrypt = require('bcryptjs');
chai.use(require('chai-http'));
const index = require('../../index');
const auth = require('../../middleware/authentication');

describe('Authentication', () => {
    describe('Hash Password', () => {
        it('should hash the new user\'s password', () => {
            const hashedPassword = auth.hashPassword('jdiew2')
            assert.equal(true, bcrypt.compareSync('jdiew2', hashedPassword));
        });
    });
});