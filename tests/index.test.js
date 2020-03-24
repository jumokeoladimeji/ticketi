/* eslint-disable no-undef */
const chai = require('chai');
const { expect, assert } = chai;
const bcrypt = require('bcryptjs');
chai.use(require('chai-http'));
const index = require('../index');

describe("Server", () => {
    it("welcomes user to the api", done => {
      chai
        .request(app)
        .get("/")
        .end((err, res) => {
            console.log('res===', res)
          expect(res).to.have.status(200);
          expect(res.body.status).to.equals("success");
          expect(res.body.message).to.equals("Welcome To Testing API");
          done();
        });
    });
});