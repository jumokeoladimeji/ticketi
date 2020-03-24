const faker = require('faker');

module.exports = {
  testCustomer: { 
    fullName: faker.internet.userName(), 
    password: '1wore93$hskks', 
    email: faker.internet.email(), 
    role: 'customer',
  },
  adminUser: {
    fullName: faker.internet.userName(), 
    password: ')12JIOPPfratweb%', 
    email: faker.internet.email(), 
    role: 'admin',
  },
  testAgent: {
    fullName: faker.internet.userName(), 
    password: 'DRR5%^890)@#2123', 
    email: faker.internet.email(), 
    role: 'agent'
  },
  invalidToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZUlkIjoyLCJpYXQiOjE0OTM2MjQ5MTcsImV4cCI6MTQ5MzcxMTMxN30.A3dy4bPUEa3QsML03UKDjqC9wcmAjV0ub8aWu1niaL'
};